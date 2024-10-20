import React from 'react'
import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, { cancelAnimation, runOnUI, scrollTo, useAnimatedRef, useDerivedValue, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated'

const colorToken = () => Math.floor(Math.random() * 255)
const data = new Array(10).fill(0).map((_, i) => ({ key: `${i}`, color: `rgba(${colorToken()}, ${colorToken()}, ${colorToken()}, 1)`} ))
const width = Dimensions.get('window').width

const CarouselItemRenderer = React.memo(({size, data, renderItem}) => {
    const actData = React.useMemo(() => [...data, data[0]], [data]);
    return actData.map((i, index) => (
        <View key={i.key} style={size}>
            {renderItem({item: i, index})}
        </View>
    ))
})
export type CarouselProps = {
    width: number;
    height: number;
    horizontal?: boolean;
    data: any[];
    renderItem: (p: any) => JSX.Element

    autoPlay?: boolean;
    autoPlayInterval?: number;
    scrollAnimationDuration?: number;
}
const Carousel = React.memo<typeof Animated.FlatList & CarouselProps>(({width, height, horizontal, data, renderItem, autoPlay, autoPlayInterval, }) => {
    const animatedScrollRef = useAnimatedRef<Animated.ScrollView>();
    const autoPlayAnimationControllerValue = useSharedValue(0)
    const currentScrollIndex = useSharedValue(0);
    const carouselItemSize = React.useMemo(() => ({width, height}), [width, height]);
    const carouselDataLength = React.useMemo(() => data.length, [data])

    const startAutoPlay = React.useCallback(() => {
        'worklet'

        autoPlayAnimationControllerValue.value = withRepeat(
            withTiming(1, {duration: autoPlayInterval}, (isDone) => {
                if (!isDone) {
                    return;
                }

                let lastScrollIndex = currentScrollIndex.value + 1;
                if (lastScrollIndex > carouselDataLength) {
                    lastScrollIndex = 0
                }
                currentScrollIndex.value = lastScrollIndex
            }),
            -1,
            true
        )
    }, [carouselItemSize, carouselDataLength, autoPlayInterval])

    const _onScrollBeginDrag = React.useCallback(() => {
        'worklet'

        cancelAnimation(autoPlayAnimationControllerValue)
    }, [])

    const _onScrollEndDrag = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        'worklet'

        let newDraggedIndex = Math.round(event.nativeEvent.contentOffset.x / carouselItemSize.width)
        if (newDraggedIndex >= carouselDataLength) {
            newDraggedIndex = 0
        }
        if (currentScrollIndex.value === newDraggedIndex) {
            currentScrollIndex.value = newDraggedIndex + 0.00001
        } else {
            currentScrollIndex.value = newDraggedIndex
        }

        if (autoPlay) {
            startAutoPlay()
        }
    }, [carouselItemSize, carouselDataLength, startAutoPlay, autoPlay, animatedScrollRef])

    useDerivedValue(() => {
        scrollTo(animatedScrollRef, currentScrollIndex.value * carouselItemSize.width, 0, true)
        if (currentScrollIndex.value === carouselDataLength) {
            scrollTo(animatedScrollRef, 0, 0, true)
            currentScrollIndex.value = 0;
        }
    }, [carouselItemSize, animatedScrollRef, currentScrollIndex])

    React.useEffect(() => {
        if (autoPlay) {
            runOnUI(startAutoPlay)()
        }
    }, [autoPlay])

    return (
        <Animated.ScrollView
            showsHorizontalScrollIndicator={false}
            ref={animatedScrollRef}
            style={carouselItemSize}
            horizontal={!!horizontal}
            onScrollBeginDrag={_onScrollBeginDrag}
            onMomentumScrollEnd={_onScrollEndDrag}
            decelerationRate='fast'
        >
            <CarouselItemRenderer size={carouselItemSize} data={data} renderItem={renderItem} />
        </Animated.ScrollView>
    )
})

export default function Page () {
    return (
        <ScrollView style={[StyleSheet.absoluteFill]}>
            <Carousel
                loop
                autoPlay={true}
                autoPlayInterval={3000}
                horizontal
                width={width}
                height={200}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={({ item, index }) => (
                    <View style={{backgroundColor: item.color, flex: 1, justifyContent: 'center'}}>
                        <Text style={{fontSize: 50, color: 'black', position: 'absolute', alignSelf: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                            {item.key}
                        </Text>
                    </View>
                )}
            />
            <Carousel
                loop
                autoPlay={true}
                autoPlayInterval={3000}
                horizontal
                width={width}
                height={200}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={({ item, index }) => (
                    <View style={{backgroundColor: item.color, flex: 1, justifyContent: 'center'}}>
                        <Text style={{fontSize: 50, color: 'black', position: 'absolute', alignSelf: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                            {item.key}
                        </Text>
                    </View>
                )}
            />
            <Carousel
                loop
                autoPlay={true}
                autoPlayInterval={3000}
                horizontal
                width={width}
                height={200}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={({ item, index }) => (
                    <View style={{backgroundColor: item.color, flex: 1, justifyContent: 'center'}}>
                        <Text style={{fontSize: 50, color: 'black', position: 'absolute', alignSelf: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                            {item.key}
                        </Text>
                    </View>
                )}
            />
            <Carousel
                loop
                autoPlay={true}
                autoPlayInterval={3000}
                horizontal
                width={width}
                height={200}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={({ item, index }) => (
                    <View style={{backgroundColor: item.color, flex: 1, justifyContent: 'center'}}>
                        <Text style={{fontSize: 50, color: 'black', position: 'absolute', alignSelf: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                            {item.key}
                        </Text>
                    </View>
                )}
            />
        </ScrollView>
    )
}