import React from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel';

const data = new Array(10).fill(0)
const width = Dimensions.get('window').width

export default function Page () {
    console.log('rendered')
    return (
        <ScrollView style={[StyleSheet.absoluteFill]}>
            <Text>
                Lib might be buggy, rendering more than one carousel and then interacting
                with pan handler stucks the snapping
            </Text>
            <Carousel
                loop
                width={width}
                height={200}
                autoPlay={true}
                autoPlayInterval={1000}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={({ index }) => (
                    <View style={{backgroundColor: 'pink', flex: 1}}>
                        <Image width={width} height={200} source={{uri: `https://picsum.photos/id/${index}/400/200`}} resizeMode="cover" />
                    </View>
                )}
            />
            <Carousel
                loop
                width={width}
                height={200}
                autoPlay={true}
                autoPlayInterval={1000}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={({ index }) => (
                    <View style={{backgroundColor: 'pink', flex: 1}}>
                        <Image width={width} height={200} source={{uri: `https://picsum.photos/id/${index}/400/200`}} resizeMode="cover" />
                    </View>
                )}
                pagingEnabled
            />
            <Carousel
                loop
                width={width}
                height={200}
                autoPlay={true}
                autoPlayInterval={1000}
                data={data}
                scrollAnimationDuration={1000}
                // onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View style={{backgroundColor: 'pink', flex: 1}}>
                        <Image width={width} height={200} source={{uri: `https://picsum.photos/id/${index}/400/200`}} resizeMode="cover" />
                    </View>
                )}
                pagingEnabled
                
            />
            <Carousel
                loop
                width={width}
                height={200}
                autoPlay={true}
                autoPlayInterval={1000}
                data={data}
                scrollAnimationDuration={1000}
                // onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View style={{backgroundColor: 'pink', flex: 1}}>
                        <Image width={width} height={200} source={{uri: `https://picsum.photos/id/${index}/400/200`}} resizeMode="cover" />
                    </View>
                )}
                pagingEnabled
               
            />
        </ScrollView>
    )
}