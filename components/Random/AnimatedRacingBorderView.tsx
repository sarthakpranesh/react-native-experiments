import React from 'react'
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Extrapolate, interpolate, measure, useAnimatedRef, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export type AnimatedRacingBorderViewProps = {
    borderWidth: number;
    borderColorForeground: string;
    borderColorBackground: string;
    borderAnimationWidth: number;
    loop: number;
    duration?: number;
    way: 'clockwise' | 'anti-clockwise'
    children: JSX.Element
}
const AnimatedRacingBorderView = React.memo<AnimatedRacingBorderViewProps>(({borderWidth, borderColorForeground, borderColorBackground, loop, way, children, borderAnimationWidth, duration}) => {
    const animatedRef = useAnimatedRef()
    const animate = useSharedValue(0)

    const [layout, setLayout] = React.useState({width: 0, height: 0})

    React.useEffect(() => {
        animate.value  = withRepeat(
            withTiming(4, {
                duration: duration ?? 2000,
                easing: Easing.linear
            }),
            -1
        )
    }, [])

    const animatedStyle = useAnimatedStyle(() => {
        if (layout.width !== 0) {
            const {height, width} = layout
            return {
                transform: [
                    {
                        translateX: interpolate(animate.value, [0, 1, 2, 3, 4], [0, width, width, 0, 0], Extrapolate.CLAMP),
                    },
                    {
                        translateY: interpolate(animate.value, [0, 1, 2, 3, 4], [0, 0, height, height, 0], Extrapolate.CLAMP),
                    },
                ]
            };
        }
        return {};
    }, [borderAnimationWidth, layout]);

    const dst = React.useMemo(() => ({
        main: {
            backgroundColor: borderColorBackground,
            padding: borderWidth,
        },
        circle: {
            backgroundColor: borderColorForeground,
            width: borderAnimationWidth,
            height: borderAnimationWidth,
            borderRadius: borderAnimationWidth / 2,
            top: -borderAnimationWidth/2,
            left: -borderAnimationWidth/2,
        }
    }), [borderColorForeground, borderColorBackground, borderWidth, borderAnimationWidth])

    return (
        <View style={[st.main, dst.main]} onLayout={(e) => setLayout({width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height})}>
            <Animated.View style={[st.circle, dst.circle, animatedStyle]}  />
            <View style={st.children}>
                {children}
            </View>
        </View>
    )
})

const st = StyleSheet.create({
    main: {
        alignSelf: 'flex-start',
        overflow: 'hidden'
    },
    circle: {
        position: 'absolute',
        zIndex: 1
    },
    children: {
        zIndex: 2
    }
})

export default AnimatedRacingBorderView