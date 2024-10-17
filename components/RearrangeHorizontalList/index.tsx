import React, { useImperativeHandle } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import Item from './Item';

// helper
const DEFAULT_TRIGGER_END_AFTER_DELAY = 4000;
const calculateNewMapping = (
  data: any[],
  keyExtractor: (item: any, index: number) => string
) => {
  const obj: any = {};
  data?.forEach((item, index) => {
    obj[keyExtractor(item, index)] = index;
  });
  return obj;
};

export type RearrangeHorizontalListProps = {
  itemHeight: number;
  itemWidth: number;
  data: any[];
  renderItem: ({
    item,
    index,
    animatedX,
    isBeingDragged,
  }: {
    item: any;
    index: number;
    animatedX: SharedValue<number>;
    isBeingDragged: SharedValue<boolean>;
  }) => JSX.Element;
  keyExtractor: (item: any, index: number) => string;
  onRearrangeEnd: (positions: any) => void;
  onScrollEndDrag?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | SharedValue<
        ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined
      >;
  contentContainerPadding?: {
    left: number;
    right: number;
  };
  hapticCallback?: () => void;
  triggerEndAfterDelay?: number;
};

const RearrangeHorizontalList = React.forwardRef<
  Animated.ScrollView,
  RearrangeHorizontalListProps
>(
  (
    {
      itemHeight,
      itemWidth,
      data,
      renderItem,
      keyExtractor,
      onRearrangeEnd,
      onScrollEndDrag,
      contentContainerPadding = { left: 0, right: 0 },
      hapticCallback,
      triggerEndAfterDelay = DEFAULT_TRIGGER_END_AFTER_DELAY,
    },
    ref
  ) => {
    const animatedScrollRef = useAnimatedRef<Animated.ScrollView>();
    const dynamicContainerDimensions = React.useMemo(
      () => ({
        width: Math.ceil(data.length) * itemWidth,
        height: itemHeight,
      }),
      [itemHeight, itemWidth, data]
    );
    const dst = React.useMemo(
      () => ({
        style: {
          height: dynamicContainerDimensions.height,
        },
        contentContainerStyle: {
          alignItems: 'center',
          height: dynamicContainerDimensions.height,
          width:
            dynamicContainerDimensions.width +
            contentContainerPadding.left +
            contentContainerPadding.right,
          marginLeft: contentContainerPadding.left,
          marginRight: contentContainerPadding.right,
        },
      }),
      [dynamicContainerDimensions, contentContainerPadding]
    );

    const isRearrangeActive = useSharedValue<boolean>(false);
    const rearrangeAnimated = useSharedValue(
      calculateNewMapping(data, keyExtractor)
    );
    const cancelRearrangeOverAnimated = useSharedValue(0);
    const scrollY = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler({
      onScroll: ({ contentOffset: { x } }) => {
        scrollY.value = x;
      },
    });

    const _uiRenderedItems = React.useMemo(() => {
      return data.map((item, index) => {
        const key = keyExtractor(item, index);
        return (
          <Item
            key={key}
            id={key}
            index={index}
            itemWidth={itemWidth}
            rearrangeAnimated={rearrangeAnimated}
            onRearrangeEnd={onRearrangeEnd}
            scrollY={scrollY}
            cancelRearrangeOverAnimated={cancelRearrangeOverAnimated}
            animatedScrollRef={animatedScrollRef}
            isRearrangeActive={isRearrangeActive}
            dynamicContainerDimensions={dynamicContainerDimensions}
            hapticCallback={hapticCallback}
            triggerEndAfterDelay={triggerEndAfterDelay}
          >
            {(
              animatedX: SharedValue<number>,
              isBeingDragged: SharedValue<boolean>
            ) => renderItem({ item, index, animatedX, isBeingDragged })}
          </Item>
        );
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      itemWidth,
      data,
      renderItem,
      keyExtractor,
      onRearrangeEnd,
      dynamicContainerDimensions,
      hapticCallback,
      triggerEndAfterDelay,
    ]);

    useImperativeHandle(
      ref,
      () => animatedScrollRef.current as Animated.ScrollView
    );

    return (
      <Animated.ScrollView
        ref={animatedScrollRef}
        style={dst.style}
        contentContainerStyle={dst.contentContainerStyle as any}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEndDrag}
      >
        {_uiRenderedItems}
      </Animated.ScrollView>
    );
  }
);

export default RearrangeHorizontalList;
