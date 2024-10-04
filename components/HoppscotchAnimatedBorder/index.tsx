import React from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  cancelAnimation,
} from "react-native-reanimated";

const EXTRA_IMAGE_WIDTH = 60

export type HoppscotchAnimatedBorderProps = {
    children: JSX.Element;
    borderWidth?: number;
    containerStyle?: ViewStyle;
}

const HoppscotchAnimatedBorder = React.memo<HoppscotchAnimatedBorderProps>(({
    children,
    borderWidth = 2,
    containerStyle = {},
  }) => {
    const progress = useSharedValue(0);
    const animatedLayout = useSharedValue({ w: 0, h: 0 });
  
    const _onLayout = React.useCallback((e: LayoutChangeEvent) => {
      const layout = e.nativeEvent.layout;
      animatedLayout.value = { w: layout.width, h: layout.height };
    }, [])
  
    React.useEffect(() => {
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 4000, easing: Easing.linear }),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      );
  
      () => cancelAnimation(progress)
    }, []);
  
    const animatedImageStyles = useAnimatedStyle(() => {
      const gradientHeightWidth = animatedLayout.value.w + EXTRA_IMAGE_WIDTH
      return {
        width: gradientHeightWidth,
        height: gradientHeightWidth,
        transform: [
          { translateY: -((gradientHeightWidth / 2)  - (animatedLayout.value.h/2 + borderWidth)) },
          { translateX: -((gradientHeightWidth / 2) - (animatedLayout.value.w/2 + borderWidth)) },
          { rotate: `${interpolate(progress.value, [0, 1], [0, 360], Extrapolation.CLAMP)}deg` }
        ]
      }
    });
  
    return (
      <View
        onLayout={_onLayout}
        style={[st.main, containerStyle]}
      >
        <Animated.Image source={require('./gradient.png')} style={[st.border, animatedImageStyles]} />
        <View style={[st.content, { padding: borderWidth }]}>{children}</View>
      </View>
    );
});

const st = StyleSheet.create({
    main: { alignSelf: "flex-start", overflow: "hidden" },
    border: {zIndex: -1, position: 'absolute'},
    content: { zIndex: 2 }
})

export default HoppscotchAnimatedBorder
