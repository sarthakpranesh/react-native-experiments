import { Extrapolate } from '@shopify/react-native-skia'
import React from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { interpolate, SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue, withDecay, withDelay, withSequence, withSpring } from 'react-native-reanimated'

const colorToken = () => Math.floor(Math.random() * 255)
const data = new Array(10).fill(0).map((_, i) => ({ key: `${i}`, color: `rgba(${colorToken()}, ${colorToken()}, ${colorToken()}, 1)`} ))
const width = Dimensions.get('window').width

export type InfiniteListAnimatedRender = {
    item: any;
    width: number;
    height: number;
    index: number;
    total: number;
    renderItem: (p: any) => JSX.Element;
    translationX: SharedValue<number>;
}
const InfiniteListAnimatedRender: React.FC<InfiniteListAnimatedRender> = ({item, width, height, index, total, renderItem, translationX}) => {
    const dst: any = React.useMemo(()=> ({
        main: {width, height, position: 'absolute'}
    }), [width, height])

    const animatedStyle = useAnimatedStyle(() => {

        const totalWidth = total * width;
        const normalizedTranslationX = (translationX.value % totalWidth + totalWidth) % totalWidth;

        // Calculate the base position for the item.
        let itemTranslationX = ((total - index) * width) - normalizedTranslationX;

        // Adjust for looping behavior.
        // When the item is scrolled past the left boundary, bring it to the right end.
        if (itemTranslationX < -width) {
            itemTranslationX += totalWidth;
        }
        // When the item is scrolled past the right boundary, bring it to the left end.
        else if (itemTranslationX >= totalWidth - width) {
            itemTranslationX -= totalWidth;
        }

        return {
            left: 0,
            transform: [{translateX: -itemTranslationX}]
        }
    }, [])

    return (
        <Animated.View style={[dst.main, animatedStyle]}>
            {renderItem({item, index})}
        </Animated.View>
    )
}
export type InfiniteListProps = {
    width: number;
    height: number;
    data: any[];
    renderItem: (p: any) => JSX.Element
    animatedIndex?: SharedValue<number>
}
const InfiniteHorizontalList = React.memo<InfiniteListProps>(({width, height, data, renderItem, animatedIndex}) => {
    const translationX = useSharedValue(0);
    const lastVelocity = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);

    const _uiRenderedList = React.useMemo(() => {
        return data.map((i, index) => <InfiniteListAnimatedRender key={i?.key} item={i} index={index} total={data.length} width={width} height={height} renderItem={renderItem} translationX={translationX} />)
    }, [width, height, data, renderItem, translationX])

    useDerivedValue(() => {
        if (animatedIndex) {
            animatedIndex.value = -((translationX.value / width) % data.length)
        }
    }, [animatedIndex, translationX])

    const pan = Gesture.Pan()
        .onStart(() => {
            prevTranslationX.value = translationX.value;
        })
        .onUpdate((event) => {
            translationX.value = prevTranslationX.value + event.translationX;
            lastVelocity.value = event.velocityX
        })
        .onEnd(() => {
            if (lastVelocity.value) {
                translationX.value = withDecay({
                        deceleration: 0.994,
                        velocity: lastVelocity.value
                    }, () => {
                        const snapToIndex = Math.round(translationX.value / width)
                        translationX.value = withSpring(snapToIndex * width)
                    })
            }
        })

    return (
        <GestureDetector gesture={pan}>
            <View style={[st.infiniteMain, {height}]}>
                {_uiRenderedList}
            </View>
        </GestureDetector>
    )
})

const AnimatedDotIndicator = ({d, animatedIndex, index}) => {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animatedIndex.value,
            [index - 1, index, index + 1],
            [0.2, 1, 0.2],
            Extrapolate.CLAMP
        ),
        transform: [
            {
                scale: interpolate(
                    animatedIndex.value,
                    [index - 1, index, index + 1],
                    [1, 2, 1],
                    Extrapolate.CLAMP
                ),
            }
        ]
    }), [])
    return (
        <Animated.View key={d.key} style={[st.dot, animatedStyle]} />
    )
}

export default function Page () {
    const animatedIndex = useSharedValue(0);

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
                <InfiniteHorizontalList
                    width={width}
                    height={200}
                    data={data}
                    renderItem={({ item, index }) => (
                        <View style={{backgroundColor: item?.color, flex: 1, justifyContent: 'center'}}>
                            <Text style={{fontSize: 50, color: 'black', position: 'absolute', alignSelf: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                                {item?.key}
                            </Text>
                        </View>
                    )}
                    animatedIndex={animatedIndex}
                />
                <View style={st.dotMain}>
                    {data.map((d, index) => (
                        <AnimatedDotIndicator key={d.key} d={d} animatedIndex={animatedIndex} index={index} />
                    ))}
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    )
}

const st = StyleSheet.create({
    infiniteMain: {flexDirection: 'row', backgroundColor: 'yellow', flex: 1, width: '100%'},
    dotMain: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 99,
        marginTop: 8,
        margin: 2,
        backgroundColor: 'black'
    }
})