import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle, Dimensions } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

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
const StarBackground = React.memo(() => {
  return (
    <View style={[StyleSheet.absoluteFill, {backgroundColor: 'black'}]}>
      <StarsLayerAnimation duration={LAYER_ONE_DURATION} />
      <StarsLayerAnimation duration={LAYER_TWO_DURATION} />
    </View>
  );
});

export default StarBackground;
