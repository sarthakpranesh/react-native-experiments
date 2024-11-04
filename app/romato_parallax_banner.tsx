import RearrangeHorizontalList from '@/components/RearrangeHorizontalList';
import React from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { InfiniteHorizontalList } from './infiniteCarousel';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';

const colorToken = () => Math.floor(Math.random() * 255);
const height = 200
const width = Dimensions.get("window").width;
const data = new Array(50).fill(0).map((_, i) => ({
  key: `${i}`,
  color: `rgba(${colorToken()}, ${colorToken()}, ${colorToken()}, 1)`,
  src: `https://picsum.photos/id/${i}/${width*2}/${height}`,
}));
const requestAnimationFrameWithContext = (callback: (d: any) => void, d: any) =>
  requestAnimationFrame(() => callback(d));

export default function Page () {
    const animatedIndex = useSharedValue(0);
    
    return (
        <GestureHandlerRootView>
            <ScrollView style={[StyleSheet.absoluteFill]}>
            <InfiniteHorizontalList
                width={width}
                height={200}
                autoScroll={false}
                    //   autoScrollDuration={2000}
                data={data}
                renderItem={({ item, index, currentIndex }) => (
                    <RenderItem item={item} index={index} currentIndex={currentIndex} />
                )}
                animatedIndex={animatedIndex}
                onItemViewedOnIndex={(i) => console.log(i)}
                renderForwardNumber={4}
            />
            </ScrollView>
        </GestureHandlerRootView>
    )
}

const RenderItem = ({item, index, currentIndex}) => {

    useDerivedValue(() => {
        console.log(currentIndex.value)
    })
    const animatedImageStyles = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            transform: [
                {
                    translateX: -width/2,
                },
                {
                    translateX: interpolate(currentIndex.value, [index - 1, index, index + 1], [-width/2, 0, width/2], Extrapolation.CLAMP)
                }
            ]
        }
    })
    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            bottom: 20, 
            left: 20,
            fontSize: 64,
            color: item?.color,
            transform: [
                {
                    translateX: interpolate(currentIndex.value, [index - 1, index, index + 1], [100, 0, -100], Extrapolation.CLAMP)
                }
            ]
        }
    })

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                width: width,
                height: height,
                paddingHorizontal: 16
            }}
        >
            <View
                style={{
                    flex: 1,
                    height: '100%',
                    width: '100%',
                    backgroundColor: item?.color,
                    borderRadius: 32,
                    overflow: 'hidden'
                }}
            >
                <Animated.Image source={{uri: item.src}} width={width * 2} height={height} resizeMode="cover" style={animatedImageStyles} />
                <Animated.Text style={animatedTextStyle}>
                    {item?.key}
                </Animated.Text>
            {/* <Text
                style={{
                fontSize: 50,
                color: "black",
                position: "absolute",
                alignSelf: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
            >
                {item?.key}
            </Text>
            <Image width={240} height={200} source={{uri: item.src }} resizeMode="cover" /> */}
            </View>
        </View>
    )
}