import React from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedProps, useAnimatedStyle, useDerivedValue, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle, SvgProps } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

const AnimatedDot = ({x, y, size, speed}) => {
    const d = useWindowDimensions()
    const yA = useSharedValue(0)

    React.useEffect(() => {
        yA.value = withRepeat(
            withTiming(d.height, {
                duration: speed,
                easing: Easing.linear
            }),
            -1,
            false,
          );
    }, [])

    const animatedPropsSvg = useAnimatedProps(() => {
        let translateY = yA.value;
        if (y + yA.value > d.height) {
            const overflow = (y + yA.value) - d.height
            translateY = overflow - y
        }
        return {
            translateY,
        }
    }, [y, yA, d])

    return (
        <AnimatedSvg width={size * 2} height={size * 2} fill="none" style={{position: 'absolute', top: y, left: x}} animatedProps={animatedPropsSvg} >
          <AnimatedCircle cx={size} cy={size} r={size} fill="#717272" />
        </AnimatedSvg>
      )
};
const getRandomStarPoints = (width, height, num) => {
    let stars = new Array(num).fill(1)
    stars= stars.map(() => {
        const x = Math.floor(Math.random() * width)
        const y = Math.floor(Math.random() * height)
        return {
            x, 
            y, 
            size: Math.floor(1 + Math.random() * 2), 
            speed: Math.floor(7000 + (Math.random() * 2000))
        }
    })
    return stars
}
const StarBackground = () => {
    const d = useWindowDimensions()
    const stars = React.useMemo(() => getRandomStarPoints(d.width, d.height, 50), [])
    return (
        <View style={[StyleSheet.absoluteFill, st.main]}>
            {stars.map((s) => <AnimatedDot x={s.x} y={s.y} size={s.size} speed={s.speed} />)}
        </View>
    )
}

const st = StyleSheet.create({
    main: {
        backgroundColor: 'black'
    }
})

export default StarBackground;