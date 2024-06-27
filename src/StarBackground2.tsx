import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle, Dimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

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
      opacity: 1 - Math.random() * 0.8,
    } as StarConfig;
  });
};

const AnimatedDot = React.memo(
  ({ config, speed }: { config: StarConfig; speed: Animated.SharedValue<number> }) => {
    const { x, y, size, opacity } = config;

    const animatedPropsSvg = useAnimatedStyle(() => {
      let translateX = speed.value;
      if (x + speed.value > width) {
        const overflow = x + speed.value - width;
        translateX = overflow - x;
      }
      return {
        transform: [{ translateX }],
      };
    }, []);

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
      [x, y, size, opacity]
    );

    return <Animated.View style={[dst, animatedPropsSvg]} />;
  }
);
const StarsLayer = React.memo(({ time, stars }: { time: number; stars: StarConfig[] }) => {
  const speed = useSharedValue(0);

  React.useEffect(() => {
    speed.value = withRepeat(
      withTiming(width, {
        duration: time,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [time]);

  return (
    <>
      {stars.map(s => (
        <AnimatedDot config={s} speed={speed} />
      ))}
    </>
  );
});
const StarBackground = React.memo(() => {

  const stars = React.useMemo(
    () => ({
      layer1: getRandomStarPoints(width, height, 10),
      layer2: getRandomStarPoints(width, height, 10),
      layer3: getRandomStarPoints(width, height, 10),
    }),
    []
  );


  return (
    <View style={StyleSheet.absoluteFill}>
      <StarsLayer time={7000} stars={stars.layer1} />
      <StarsLayer time={6000} stars={stars.layer2} />
      <StarsLayer time={5000} stars={stars.layer3} />
    </View>
  );
});

export default StarBackground;
