import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolate,
  measure,
  runOnJS,
  scrollTo,
  type SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

// helpers
const WAIT_BEFORE_SETTING_NEW_ARRANGEMENT = 3000;
const MAX_AUTO_SCROLL_THRESHOLD = 20;
const getPosition = (index: number, itemWidth: number) => {
  'worklet';

  return index * itemWidth;
};
const getOrder = (tx: number, max: number, itemWidth: number) => {
  'worklet';

  const x = Math.round(tx / itemWidth);
  return Math.min(x, max);
};
const scaleUpDownAnimation = (state: 0 | 1) => {
  'worklet';

  return withSpring(state, {
    damping: 8,
    overshootClamping: false,
  });
};
const positionSetAnimation = (position: number, callback?: () => void) => {
  'worklet';

  return withSpring(
    position,
    {
      damping: 80,
      overshootClamping: true,
      restDisplacementThreshold: 0.1,
      restSpeedThreshold: 0.1,
      stiffness: 500,
    },
    callback
  );
};

export type ItemProps = {
  index: number;
  id: string;
  rearrangeAnimated: SharedValue<any>;
  itemWidth: number;
  children: (
    animatedX: SharedValue<number>,
    isBeingDragged: SharedValue<boolean>
  ) => React.ReactElement;
  onRearrangeEnd: (position: any) => void;
  scrollY: SharedValue<number>;
  animatedScrollRef: React.RefObject<Animated.ScrollView>;
  cancelRearrangeOverAnimated: SharedValue<number>;
  isRearrangeActive: SharedValue<boolean>;
  dynamicContainerDimensions: { width: number; height: number };
  hapticCallback?: () => void;
  triggerEndAfterDelay: number;
};

const Item = React.memo<ItemProps>(
  ({
    index,
    id,
    rearrangeAnimated,
    children,
    itemWidth,
    onRearrangeEnd,
    scrollY,
    animatedScrollRef,
    cancelRearrangeOverAnimated,
    isRearrangeActive,
    dynamicContainerDimensions,
    hapticCallback,
    triggerEndAfterDelay,
  }) => {
    const numOfOrders = Object.keys(rearrangeAnimated.value).length - 1;
    const position = getPosition(index, itemWidth);

    const rearrangeStarted = useSharedValue(0);
    const shouldUpdateRearrangement = useSharedValue(false);

    const animatedRef = useAnimatedRef<Animated.View>();
    const animatedY = useSharedValue(position);

    const gesture = Gesture.Pan()
      .activateAfterLongPress(600)
      .activeOffsetX([-10, 10])
      .shouldCancelWhenOutside(false)
      .onStart(() => {
        // give user haptic feedback
        if (hapticCallback) {
          runOnJS(hapticCallback)();
        }

        // cancel any previous rearrangement to avoid race conditions
        cancelAnimation(cancelRearrangeOverAnimated);

        // run rearrangement started animations
        rearrangeStarted.value = scaleUpDownAnimation(1);
        isRearrangeActive.value = true;
      })
      .onChange((e) => {
        // update current position of draggable item
        animatedY.value = animatedY.value + e.changeX;

        // fetch new ordered position of item
        const newOrder = getOrder(animatedY.value, numOfOrders, itemWidth);

        // swap items if required
        const oldOlder = rearrangeAnimated.value[id];
        if (newOrder !== oldOlder && oldOlder !== undefined) {
          const idToSwap = Object.keys(rearrangeAnimated.value).find(
            (key) => rearrangeAnimated.value[key] === newOrder
          );

          if (idToSwap) {
            // Spread operator is not supported in worklets
            // And Object.assign doesn't seem to be working on alpha.6
            const newPositions = { ...rearrangeAnimated.value };
            newPositions[id] = newOrder;
            newPositions[idToSwap] = oldOlder;
            rearrangeAnimated.value = newPositions;

            shouldUpdateRearrangement.value = true;
          }
        }

        // scroll items
        const lowerBound = scrollY.value;
        if (animatedY.value < lowerBound && e.changeX < 0) {
          const diff = Math.min(
            lowerBound - animatedY.value,
            MAX_AUTO_SCROLL_THRESHOLD
          );

          if (scrollY.value - diff >= 0) {
            scrollY.value = scrollY.value - diff;
            scrollTo(animatedScrollRef as any, scrollY.value, 0, false);
            animatedY.value = animatedY.value - diff;
          }
        }
        const m = measure(animatedScrollRef as any);
        if (m) {
          const upperBound = lowerBound + m.width - itemWidth;
          if (animatedY.value > upperBound && e.changeX > 0) {
            const diff = Math.min(
              animatedY.value - upperBound,
              MAX_AUTO_SCROLL_THRESHOLD
            );
            if (dynamicContainerDimensions.width >= scrollY.value + diff) {
              scrollY.value = scrollY.value + diff;
              scrollTo(animatedScrollRef as any, scrollY.value, 0, false);
              if (diff + animatedY.value <= dynamicContainerDimensions.width) {
                animatedY.value = diff + animatedY.value;
              }
            }
          }
        }
      })
      .onEnd(() => {
        const newOrder = rearrangeAnimated.value[id];
        const newPosition = getPosition(newOrder, itemWidth);
        animatedY.value = positionSetAnimation(newPosition, () => {
          rearrangeStarted.value = scaleUpDownAnimation(0);
        });

        if (shouldUpdateRearrangement.value) {
          shouldUpdateRearrangement.value = false;

          cancelRearrangeOverAnimated.value = withDelay(
            triggerEndAfterDelay ?? WAIT_BEFORE_SETTING_NEW_ARRANGEMENT,
            withSpring(1, {}, (finished) => {
              if (finished) {
                runOnJS(onRearrangeEnd)(rearrangeAnimated.value);
                isRearrangeActive.value = false;
              }
            })
          );
        }
      });

    // shift items that are rearranged due to draggable item moving around
    useAnimatedReaction(
      () => rearrangeAnimated.value[id],
      (current, previous) => {
        if (
          rearrangeStarted.value === 0 &&
          current !== previous &&
          current !== undefined
        ) {
          const position = getPosition(current, itemWidth);
          animatedY.value = positionSetAnimation(position);
        }
      },
      [rearrangeAnimated]
    );

    const animatedStyles = useAnimatedStyle(() => {
      return {
        position: 'absolute',
        width: itemWidth,
        transform: [
          { translateX: animatedY.value },
          { scale: interpolate(rearrangeStarted.value, [0, 1], [1, 1.2]) },
        ],
        zIndex: interpolate(rearrangeStarted.value, [0, 0.4], [1, 4]),
      };
    });
    const animatedProps = useAnimatedProps(() => ({
      pointerEvents: isRearrangeActive.value ? 'box-only' : 'auto',
    }));
    const isBeingDragged = useDerivedValue(() => rearrangeStarted.value === 1);

    return (
      <Animated.View ref={animatedRef} style={[animatedStyles]}>
        <GestureDetector gesture={gesture}>
          <Animated.View animatedProps={animatedProps as any}>
            {children(animatedY, isBeingDragged)}
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    );
  }
);

export default Item;
