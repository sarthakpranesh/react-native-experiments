import { Extrapolate } from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  runOnUI,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const colorToken = () => Math.floor(Math.random() * 255);
const data = new Array(50).fill(0).map((_, i) => ({
  key: `${i}`,
  color: `rgba(${colorToken()}, ${colorToken()}, ${colorToken()}, 1)`,
}));
const width = Dimensions.get("window").width;
const requestAnimationFrameWithContext = (callback: (d: any) => void, d: any) =>
  requestAnimationFrame(() => callback(d));

export type InfiniteListAnimatedRender = {
  item: any;
  width: number;
  height: number;
  index: number;
  total: number;
  renderForwardNumber: number;
  renderItem: (p: any) => JSX.Element;
  animatedIndex: SharedValue<number>;
};
const InfiniteListAnimatedRender: React.FC<InfiniteListAnimatedRender> = ({
  item,
  width,
  height,
  index,
  total,
  renderForwardNumber,
  renderItem,
  animatedIndex,
}) => {
  const dst: any = React.useMemo(
    () => ({
      main: { width, height, position: "absolute" },
    }),
    [width, height],
  );

  const normalizedIndex = useDerivedValue(() => {
    let displayOnIndex = index - animatedIndex.value;

    // wrap the index around when it goes out of bounds
    if (displayOnIndex < -renderForwardNumber) {
      displayOnIndex += total;
    } else if (displayOnIndex >= renderForwardNumber) {
      displayOnIndex -= total;
    }

    // boost performance if item not on screen, by avoiding changing the value
    // so useAnimatedStyle callback is not computed
    if (
      displayOnIndex >= renderForwardNumber ||
      displayOnIndex <= -renderForwardNumber
    ) {
      return renderForwardNumber;
    }
    return displayOnIndex;
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    const itemTranslationX = normalizedIndex.value * width;

    return {
      left: 0,
      transform: [{ translateX: itemTranslationX }],
    };
  }, []);

  return (
    <Animated.View style={[dst.main, animatedStyle]}>
      {renderItem({ item, index, currentIndex: animatedIndex })}
    </Animated.View>
  );
};
export type InfiniteListProps = {
  type?: "carousel" | "smooth";
  width: number;
  height: number;
  autoScroll?: boolean;
  autoScrollDuration?: number;
  renderForwardNumber?: number;
  data: any[];
  renderItem: (p: any) => JSX.Element;
  animatedIndex?: SharedValue<number>;
  onItemViewedOnIndex?: (item: any) => void;
};
export const InfiniteHorizontalList = React.memo<InfiniteListProps>(
  ({
    type = "carousel",
    width,
    height,
    autoScroll,
    autoScrollDuration = 3000,
    renderForwardNumber = 1,
    data: d,
    renderItem,
    animatedIndex,
    onItemViewedOnIndex,
  }) => {
    const translationX = useSharedValue(0);
    const lastVelocity = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);
    const autoPlayAnimationControllerValue = useSharedValue(0);
    const itemViewedIndexControllerValue = useSharedValue(0);
    const internalAnimatedIndex = useSharedValue(0);

    const data = React.useMemo(() => {
      if (d.length > 20) {
        console.warn(
          "InfiniteHorizontalList WARNING: Won't render more than 20 items in list because of performance reasons",
        );
        return d.slice(0, 20);
      }

      return d;
    }, [d]);

    const startAutoPlay = React.useCallback(() => {
      "worklet";

      autoPlayAnimationControllerValue.value = withRepeat(
        withDelay(
          autoScrollDuration,
          withSpring(0, { duration: 0 }, () => {
            const d = Math.round(translationX.value / width);
            translationX.value = withTiming((d - 1) * width, {
              duration: 1000,
            });
          }),
        ),
        -1,
      );
    }, [autoScrollDuration, width, data]);

    React.useEffect(() => {
      if (autoScroll) {
        runOnUI(startAutoPlay)();
      }
    }, [autoScroll]);

    const _uiRenderedList = React.useMemo(() => {
      return data.map((i, index) => (
        <InfiniteListAnimatedRender
          key={i?.key}
          item={i}
          index={index}
          total={data.length}
          width={width}
          height={height}
          renderForwardNumber={renderForwardNumber}
          renderItem={renderItem}
          animatedIndex={internalAnimatedIndex}
        />
      ));
    }, [width, height, data, renderItem, translationX, renderForwardNumber]);

    useDerivedValue(() => {
      let index = -((translationX.value / width) % data.length);
      if (index < 0) {
        index = data.length + index;
      }
      internalAnimatedIndex.value = index;
      if (animatedIndex) {
        animatedIndex.value = index;
      }

      if (onItemViewedOnIndex) {
        const roundedIndex = Math.round(index);
        if (
          itemViewedIndexControllerValue.value !== roundedIndex &&
          roundedIndex < data.length &&
          roundedIndex >= 0
        ) {
          itemViewedIndexControllerValue.value = roundedIndex;
          runOnJS(requestAnimationFrameWithContext)(
            onItemViewedOnIndex,
            data[roundedIndex],
          );
        }
      }
    }, [animatedIndex, onItemViewedOnIndex, data]);

    const pan = Gesture.Pan()
      .activeOffsetX([-10, 10])
      .onStart(() => {
        cancelAnimation(autoPlayAnimationControllerValue);
        prevTranslationX.value = translationX.value;
      })
      .onUpdate((event) => {
        translationX.value = prevTranslationX.value + event.translationX;
        lastVelocity.value = event.velocityX;
      })
      .onEnd(() => {
        if (lastVelocity.value) {
          if (type === "smooth") {
            translationX.value = withDecay(
              {
                deceleration: 0.998,
                velocity: lastVelocity.value,
              },
              () => {
                const snapToIndex = Math.round(translationX.value / width);
                translationX.value = withTiming(
                  snapToIndex * width,
                  { duration: 200 },
                  () => {
                    if (autoScroll) {
                      startAutoPlay();
                    }
                  },
                );
              },
            );
            return;
          }

          if (type === "carousel") {
            let movingTo = 0;
            if (lastVelocity.value < -1000) {
              movingTo = -1;
            }
            if (lastVelocity.value > 1000) {
              movingTo = 1;
            }
            let snapToIndex = Math.round(translationX.value / width) + movingTo;
            translationX.value = withTiming(
              snapToIndex * width,
              {
                duration: 200,
              },
              () => {
                if (autoScroll) {
                  startAutoPlay();
                }
              },
            );
            return;
          }
        }
      });

    return (
      <GestureDetector gesture={pan}>
        <View style={[st.infiniteMain, { height }]}>{_uiRenderedList}</View>
      </GestureDetector>
    );
  },
);

const AnimatedDotIndicator = ({ d, animatedIndex, index, total }) => {
  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        animatedIndex.value,
        [index - 1, index, index + 1],
        [0.2, 1, 0.2],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            animatedIndex.value,
            [
              index - 1 < 0 ? total - 1 : index - 1,
              index,
              index + 1 > total ? 0 : index + 1,
            ],
            [1, 2, 1],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [],
  );
  return <Animated.View key={d.key} style={[st.dot, animatedStyle]} />;
};

export default function Page() {
  const animatedIndex = useSharedValue(0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <InfiniteHorizontalList
          width={width}
          height={200}
          autoScroll={true}
          autoScrollDuration={2000}
          data={data}
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor: item?.color,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 50,
                  color: "black",
                  position: "absolute",
                  alignSelf: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                {item?.key}
              </Text>
            </View>
          )}
          animatedIndex={animatedIndex}
          onItemViewedOnIndex={(i) => console.log(i)}
        />
        <View style={st.dotMain}>
          {data.map((d, index) => (
            <AnimatedDotIndicator
              key={d.key}
              total={data.length}
              d={d}
              animatedIndex={animatedIndex}
              index={index}
            />
          ))}
        </View>

        <InfiniteHorizontalList
          type="carousel"
          width={width * 0.8}
          height={200}
          data={data}
          renderForwardNumber={3}
          autoScroll
          autoScrollDuration={5000}
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor: item?.color,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 50,
                  color: "black",
                  position: "absolute",
                  alignSelf: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                {item?.key}
              </Text>
            </View>
          )}
          onItemViewedOnIndex={(i) => console.log(i)}
        />
        <InfiniteHorizontalList
          type="smooth"
          width={width * 0.8}
          height={200}
          data={data}
          renderForwardNumber={3}
          autoScroll
          autoScrollDuration={5000}
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor: item?.color,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 50,
                  color: "black",
                  position: "absolute",
                  alignSelf: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              >
                {item?.key}
              </Text>
            </View>
          )}
          onItemViewedOnIndex={(i) => console.log(i)}
        />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const st = StyleSheet.create({
  infiniteMain: {
    flexDirection: "row",
    backgroundColor: "yellow",
    flex: 1,
    width: "100%",
  },
  dotMain: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 99,
    marginTop: 8,
    margin: 2,
    backgroundColor: "black",
  },
});
