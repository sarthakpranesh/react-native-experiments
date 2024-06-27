import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import RemoteImage from 'src/presentation/elements/remoteImage';
import { colors } from 'src/presentation/orbit/common/constants';

const CarLoader = () => {
  const animationController = useSharedValue(0);
  const lightAnimator = useSharedValue(0);

  React.useEffect(() => {
    animationController.value = withRepeat(
      withTiming(8, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const carVerticalMovement = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(
            animationController.value,
            [0, 2, 3, 4, 5, 6, 7, 8],
            [0, -40, 0, 40, 0, -40, 0, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    }),
    []
  );
  const carHeadLightFlicker = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        lightAnimator.value,
        [0, 0.2, 0.3, 0.4, 1],
        [0, 0.6, 0, 0.6, 1],
        Extrapolate.CLAMP
      ),
    }),
    []
  );

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      console.log('fdjsbfjdsb');
      lightAnimator.value = withTiming(1, {
        duration: 3000,
      });
    },
    onFinish: () => {
      console.log('fdjsbfjdsb');
      lightAnimator.value = withTiming(0, {
        duration: 1000,
      });
    },
  });

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, st.main]}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[st.carWrapper, carVerticalMovement]}>
            <RemoteImage
              source={require('./car.png')}
              style={st.carImage}
              handleBaseUrl={false}
              showShimmer={false}
              useFastImage
              resizeMode="contain"
            />

            <Animated.View style={[carHeadLightFlicker]}>
              <RemoteImage
                source={require('./light.png')}
                style={[st.headLight]}
                handleBaseUrl={false}
                showShimmer={false}
                useFastImage
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View style={[carHeadLightFlicker]}>
              <RemoteImage
                source={require('./light.png')}
                style={[st.headLight2]}
                handleBaseUrl={false}
                showShimmer={false}
                useFastImage
                resizeMode="contain"
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

const st = StyleSheet.create({
  main: {
    backgroundColor: colors.custom.mainBackGround,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: 100,
    aspectRatio: 1,
    position: 'absolute',
    alignSelf: 'center',
  },
  headLight: {
    position: 'absolute',
    width: 100,
    aspectRatio: 1,
    alignSelf: 'center',
    transform: [{ translateX: -30 }, { translateY: -60 }],
  },
  headLight2: {
    position: 'absolute',
    width: 100,
    aspectRatio: 1,
    alignSelf: 'center',
    transform: [{ translateX: 30 }, { translateY: -60 }, { scaleX: -1 }],
  },
});

export default CarLoader;
