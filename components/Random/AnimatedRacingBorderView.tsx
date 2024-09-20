import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export type AnimatedRacingBorderViewProps = {
  borderWidth: number;
  borderColorForeground: string;
  borderColorBackground: string;
  borderAnimationWidth: number;
  duration?: number;
  children: JSX.Element;
  style?: ViewStyle;
};
const AnimatedRacingBorderView = React.memo<AnimatedRacingBorderViewProps>(
  ({
    borderWidth,
    borderColorForeground,
    borderColorBackground,
    children,
    borderAnimationWidth,
    duration,
    style,
  }) => {
    const animate = useSharedValue(0);

    const [layout, setLayout] = React.useState({
      width: 0,
      height: 0,
      aspectRatio: 0,
    });

    React.useEffect(() => {
      if (layout.width !== 0) {
        const maxDuration = duration ?? 2000;
        const eachPoleDuration = maxDuration / 5;
        const alternatePoleDurationModifier =
          (layout.aspectRatio - 1) * eachPoleDuration;

        animate.value = withRepeat(
          withSequence(
            withTiming(1, {
              duration: eachPoleDuration,
              easing: Easing.linear,
            }),
            withTiming(2, {
              duration: eachPoleDuration + alternatePoleDurationModifier,
              easing: Easing.linear,
            }),
            withTiming(3, {
              duration: eachPoleDuration,
              easing: Easing.linear,
            }),
            withTiming(4, {
              duration: eachPoleDuration + alternatePoleDurationModifier,
              easing: Easing.linear,
            }),
          ),
          -1,
        );
      }
    }, [layout]);

    const animatedStyle = useAnimatedStyle(() => {
      if (layout.width !== 0) {
        const { height, width } = layout;
        return {
          transform: [
            {
              translateX: interpolate(
                animate.value,
                [0, 1, 2, 3, 4],
                [0, width, width, 0, 0],
                Extrapolate.CLAMP,
              ),
            },
            {
              translateY: interpolate(
                animate.value,
                [0, 1, 2, 3, 4],
                [0, 0, height, height, 0],
                Extrapolate.CLAMP,
              ),
            },
          ],
        };
      }
      return {};
    }, [layout]);

    const dst = React.useMemo(
      () => ({
        main: {
          backgroundColor: borderColorBackground,
          padding: borderWidth,
        },
        circle: {
          backgroundColor: borderColorForeground,
          width: borderAnimationWidth,
          height: borderAnimationWidth,
          borderRadius: borderAnimationWidth / 2,
          top: -borderAnimationWidth / 2,
          left: -borderAnimationWidth / 2,
        },
      }),
      [
        borderColorForeground,
        borderColorBackground,
        borderWidth,
        borderAnimationWidth,
      ],
    );

    return (
      <View
        style={[st.main, dst.main, style]}
        onLayout={(e) =>
          setLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
            aspectRatio:
              e.nativeEvent.layout.height / e.nativeEvent.layout.width,
          })
        }
      >
        <Animated.View style={[st.circle, dst.circle, animatedStyle]} />
        <View style={st.children}>{children}</View>
      </View>
    );
  },
);

const st = StyleSheet.create({
  main: {
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    zIndex: 1,
  },
  children: {
    zIndex: 2,
  },
});

export default AnimatedRacingBorderView;
