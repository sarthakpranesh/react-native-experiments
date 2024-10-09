import { Blend, Canvas, Fill, FractalNoise, interpolateColors, LinearGradient, RadialGradient, Rect, Turbulence, vec } from '@shopify/react-native-skia';
import React, { useDeferredValue, useEffect } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle, Dimensions, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Stop } from 'react-native-svg';

const {width, height} = Dimensions.get('screen')

const LAYER_ONE_DURATION = 9000;
const LAYER_TWO_DURATION = 12000;
const STAR_OPACITY = 0.7;

type StarConfig = {
  x: number;
  y: number;
  size: number;
  opacity: number;
};
const getRandomStarPoints = (width: number, height: number, num: number): StarConfig[] => {
  const stars = new Array(num).fill(1);
  return stars.map(() => {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    return {
      x,
      y,
      size: Math.floor(1 + Math.random() * 1),
      opacity: STAR_OPACITY - Math.random() * 0.5,
    } as StarConfig;
  });
};

const Dot = React.memo(({ config }: { config: StarConfig }) => {
  const { x, y, size, opacity } = config;

  const dst = React.useMemo(
    () =>
      ({
        position: 'absolute',
        top: y,
        left: x,
        opacity,
        width: size * 2,
        height: size * 2,
        backgroundColor: 'white',
        borderRadius: size,
      } as StyleProp<ViewStyle>),
    []
  );

  return <View style={dst} />;
});
const StarsLayer = React.memo(
  ({ stars, speed }: { speed: SharedValue<number>; stars: StarConfig[] }) => {
    const dst = React.useMemo(
      () =>
        ({
          position: 'absolute',
          flex: 1,
          height,
          width,
        } as StyleProp<ViewStyle>),
      []
    );
    const starDots = React.useMemo(() => {
      return stars.map(s => <Dot config={s} />);
    }, []);

    const animatedPropsSvg = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: speed.value }],
      };
    }, []);

    return <Animated.View style={[dst, animatedPropsSvg]}>{starDots}</Animated.View>;
  }
);
const StarsLayerAnimation = React.memo(({ duration }: { duration: number }) => {
  const speed1 = useSharedValue(0);
  const speed2 = useSharedValue(0);

  const startAnimations = React.useCallback(() => {
    speed1.value = 0;
    speed1.value = withRepeat(
      withSequence(
        withTiming(width, {
          duration,
          easing: Easing.linear,
        }),
        withTiming(-width, {
          duration: 0,
          easing: Easing.linear,
        }),
        withTiming(0, {
          duration,
          easing: Easing.linear,
        })
      ),
      -1,
      false
    );

    speed2.value = -width;
    speed2.value = withRepeat(
      withSequence(
        withTiming(0, {
          duration,
          easing: Easing.linear,
        }),
        withTiming(width, {
          duration,
          easing: Easing.linear,
        }),
        withTiming(-width, {
          duration: 0,
          easing: Easing.linear,
        })
      ),
      -1,
      false
    );
  }, []);

  const stopAnimations = React.useCallback(() => {
    speed1.value = 0;
    speed2.value = -width;
  }, []);

  React.useEffect(() => {
    startAnimations()
  }, [])

  const stars = React.useMemo(
    () => ({
      layer1: getRandomStarPoints(width, height, 60),
      layer2: getRandomStarPoints(width, height, 60),
    }),
    []
  );

  return (
    <>
      <StarsLayer speed={speed1} stars={stars.layer1} />
      <StarsLayer speed={speed2} stars={stars.layer2} />
    </>
  );
});
const StarBackgroundWithGradient = React.memo(() => {

  return (
    <View style={[StyleSheet.absoluteFill, {backgroundColor: 'black'}]}>
      <Canvas style={{ flex: 1 }}>
        <Fill>
          <Blend mode="dstOver">
            <AnimatedGradient />
            <RadialGradient
              r={width*0.7}
              c={vec(width/2, height/2 - 100)}
              colors={["#000243", "#000000"]}
            />
          </Blend>
        </Fill>
      </Canvas>
      <StarsLayerAnimation duration={LAYER_ONE_DURATION} />
      <StarsLayerAnimation duration={LAYER_TWO_DURATION} />
    </View>
  );
});


 
export const AnimatedGradient = () => {
  const startColors = [
    "rgba(1, 8, 27, 1)",
    "rgba(1, 8, 27, 1)",
    "rgba(0, 2, 67, 1)",
    "rgba(0, 2, 67, 1)",
    "rgba(1, 8, 27, 1)",
    "rgba(1, 8, 27, 1)",
  ];

  const endColors = [
    "rgba(1, 8, 27, 1)",
    "rgba(0, 2, 67, 1)",
    "rgba(0, 2, 67, 1)",
    "rgba(1, 8, 27, 1)",
    "rgba(1, 8, 27, 1)",
    "rgba(0, 2, 67, 1)",
    "rgba(0, 2, 67, 1)",
  ];

  const { width, height } = useWindowDimensions();
  const colorsIndex = useSharedValue(0);
  useEffect(() => {
    colorsIndex.value = withRepeat(
      withTiming(endColors.length - 1, {
          duration: 16000,
      }),
      -1,
      true
    );
  }, []);

  const gradientColors = useDerivedValue(() => {
    return [
      interpolateColors(colorsIndex.value, [0, 1, 2, 3], startColors),
      interpolateColors(colorsIndex.value, [0, 1, 2, 3], endColors),
    ];
  });

  return (
    <LinearGradient
      start={vec(0, 0)}
      end={vec(width, height)}
      colors={gradientColors}
    />
  );
};

export default StarBackgroundWithGradient;

