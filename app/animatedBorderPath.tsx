import React from "react";
import { StyleSheet, View, LayoutChangeEvent } from "react-native";
import { Path, Svg } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedRef,
  measure,
  useDerivedValue,
  withSequence,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const dFunc = (w, h) => {
  "worklet";

  return `M0 0 H${w} V${h} H0 V0 Z`;
};

const AnimatedBorderWrapper = ({
  children,
  borderWidth = 2,
  staticBorderColor = "red",
  animatedBorderColor = "green",
  containerStyle = {},
}) => {
  const strokeWidthToUse = React.useMemo(() => 4 * borderWidth, [borderWidth]);
  const [length, setLength] = React.useState(0);
  const ref = React.useRef<any>(null);
  const progress = useSharedValue(0);
  const animatedRef = useAnimatedRef<Animated.View>();
  const animatedLayout = useSharedValue({ w: 0, h: 0 });

  React.useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, []);

  const animatedSvgProps = useAnimatedProps(() => ({
    width: animatedLayout.value.w,
    height: animatedLayout.value.h,
  }));
  const staticBorderProps = useAnimatedProps(() => ({
    d: dFunc(animatedLayout.value.w, animatedLayout.value.h),
  }));
  const strokeAnimationStatic = useAnimatedProps(() => ({
    d: dFunc(animatedLayout.value.w, animatedLayout.value.h),
    strokeDashoffset:
      length - length * Easing.bezierFn(0.61, 1, 0.88, 1)(progress.value), // Easing.bezier(0.61, 1, 0.88, 1)
  }));
  const strokeAnimation = useAnimatedProps(() => ({
    d: dFunc(animatedLayout.value.w, animatedLayout.value.h),
    strokeDashoffset:
      length - length * Easing.bezierFn(0.1, 1, 0.4, 1)(progress.value), // Easing.bezier(0.61, 1, 0.88, 1)
  }));

  return (
    <View
      ref={animatedRef}
      onLayout={(e) => {
        const layout = e.nativeEvent.layout;
        animatedLayout.value = { w: layout.width, h: layout.height };
      }}
      style={[{ alignSelf: "flex-start" }, containerStyle]}
    >
      <AnimatedSvg
        style={{ position: "absolute", zIndex: -1 }}
        animatedProps={animatedSvgProps}
        fill="none"
      >
        <AnimatedPath
          animatedProps={staticBorderProps}
          stroke={staticBorderColor}
          strokeWidth={strokeWidthToUse}
          strokeDasharray={length}
          fill="transparent"
          onLayout={() => setLength(ref.current?.getTotalLength() || 0)}
          ref={ref}
        />
        <AnimatedPath
          animatedProps={strokeAnimation}
          stroke={animatedBorderColor}
          strokeWidth={strokeWidthToUse}
          strokeDasharray={length}
          fill="transparent"
        />
        <AnimatedPath
          animatedProps={strokeAnimationStatic}
          stroke={staticBorderColor}
          strokeWidth={strokeWidthToUse}
          strokeDasharray={length}
          fill="transparent"
        />
      </AnimatedSvg>
      <View style={{ padding: borderWidth, zIndex: 1 }}>{children}</View>
    </View>
  );
};

export default function Page() {
  return (
    <View style={[StyleSheet.absoluteFill, { padding: 10 }]}>
      <AnimatedBorderWrapper
        borderWidth={4}
        staticBorderColor="black"
        animatedBorderColor="white"
      >
        <View style={{ width: 200, height: 100, backgroundColor: "pink" }} />
      </AnimatedBorderWrapper>
      <View style={{ height: 20 }} />
      <AnimatedBorderWrapper>
        <View style={{ width: 200, height: 100, backgroundColor: "pink" }} />
      </AnimatedBorderWrapper>
      <View style={{ height: 20 }} />
      <AnimatedBorderWrapper>
        <View style={{ width: 200, height: 100, backgroundColor: "pink" }} />
      </AnimatedBorderWrapper>
      <View style={{ height: 20 }} />
      <AnimatedBorderWrapper>
        <View style={{ width: 200, height: 100, backgroundColor: "pink" }} />
      </AnimatedBorderWrapper>
      <View style={{ height: 20 }} />
      <AnimatedBorderWrapper>
        <View style={{ width: 200, height: 100, backgroundColor: "pink" }} />
      </AnimatedBorderWrapper>
    </View>
  );
}
