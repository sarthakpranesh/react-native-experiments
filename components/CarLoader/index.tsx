import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const CarLoader = () => {
  const animationController = useSharedValue(0);
  const lightAnimator = useSharedValue(0);
  const rippleAnimator = useSharedValue(0);
  const rippleAnimator2 = useSharedValue(0);
  const rippleAnimator3 = useSharedValue(0);

  React.useEffect(() => {
    animationController.value = withRepeat(
      withTiming(8, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
    rippleAnimator.value = withRepeat(
      withTiming(1, {
        duration: 3000,
        easing: Easing.linear
      }),
      -1,
      false
    )
    rippleAnimator2.value = withDelay(
      1000,
      withRepeat(
        withTiming(1, {
          duration: 3000,
          easing: Easing.linear
        }),
        -1,
        false
      )
    )
    rippleAnimator3.value = withDelay(
      2000,
      withRepeat(
        withTiming(1, {
          duration: 3000,
          easing: Easing.linear
        }),
        -1,
        false
      )
    )
  }, []);

  const carVerticalMovement = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(
            animationController.value,
            [0, 2, 3, 4, 5, 6, 7, 8],
            [0, -40, 0, 0, 40, 0, -40, 0],
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
      ),
    }),
    []
  );
  const carRipple1 = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        rippleAnimator.value,
        [0, 0.8, 1],
        [1, 0.6, 0]
      ),
      transform: [
        {
          scale: interpolate(
            rippleAnimator.value,
            [0, 1],
            [0, 4]
          )
        }
      ],
      borderWidth: interpolate(
        rippleAnimator.value,
        [0, 0.6, 1],
        [1, 0.8, 0]
      )
    })
  )
  const carRipple2 = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        rippleAnimator2.value,
        [0, 0.8, 1],
        [1, 0.6, 0]
      ),
      transform: [
        {
          scale: interpolate(
            rippleAnimator2.value,
            [0, 1],
            [0, 4]
          )
        }
      ],
      borderWidth: interpolate(
        rippleAnimator2.value,
        [0, 0.6, 1],
        [1, 0.8, 0]
      )
    })
  )
  const carRipple3 = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        rippleAnimator3.value,
        [0, 0.8, 1],
        [1, 0.6, 0]
      ),
      transform: [
        {
          scale: interpolate(
            rippleAnimator3.value,
            [0, 1],
            [0, 4]
          )
        }
      ],
      borderWidth: interpolate(
        rippleAnimator3.value,
        [0, 0.6, 1],
        [1, 0.8, 0]
      )
    })
  )

  const tapGesture = Gesture.Tap().onStart(() => {
    lightAnimator.value = 0
    lightAnimator.value = withSequence(
      withTiming(1, {
        duration: 3000,
      }),
      withDelay(1000,
        withTiming(0, {
          duration: 1000,
        })
      )
    );
  });

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <GestureDetector gesture={tapGesture}>
        <View style={[StyleSheet.absoluteFill, st.main]}>
          <Animated.View style={[st.carWrapper, carVerticalMovement]}>
            <Image
              source={require('./car.png')}
              style={st.carImage}
              resizeMode="contain"
            />

            <Animated.Image
              source={require('./light.png')}
              style={[st.headLight, carHeadLightFlicker]}
              resizeMode="contain"
            />

            <Animated.Image
              source={require('./light.png')}
              style={[st.headLight2, carHeadLightFlicker]}
              resizeMode="contain"
            />

            <Animated.View style={[st.ripple, carRipple1]} />
            <Animated.View style={[st.ripple, carRipple2]} />
            <Animated.View style={[st.ripple, carRipple3]} />
          </Animated.View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const st = StyleSheet.create({
  main: {
    backgroundColor: 'black',
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
    height: 800,
    width: 400,
    overflow: 'hidden',
  },
  carImage: {
    width: 140,
    aspectRatio: 1,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 2
  },
  headLight: {
    position: 'absolute',
    width: 140,
    aspectRatio: 1,
    alignSelf: 'center',
    transform: [{ translateX: -64 }, { translateY: -140 }],
    zIndex: 1,
  },
  headLight2: {
    position: 'absolute',
    width: 140,
    aspectRatio: 1,
    alignSelf: 'center',
    transform: [{ translateX: 64 }, { translateY: -140 }, { scaleX: -1 }],
    zIndex: 1,
  },
  ripple: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'white',
    height: 100,
    width: 100,
    zIndex: 1,
    alignSelf: 'center',
    position: 'absolute'
  }
});

export default CarLoader;
