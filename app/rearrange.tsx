import RearrangeHorizontalList from '@/components/RearrangeHorizontalList';
import React from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const data = new Array(10).fill(0).map((_, index) => ({
    src: `https://picsum.photos/id/${index}/400/200`,
    key: `${index + 1}`
}))
const width = Dimensions.get('window').width

export default function Page () {
    console.log('rendered')
    return (
        <GestureHandlerRootView>
        <ScrollView style={[StyleSheet.absoluteFill]}>
            <RearrangeHorizontalList
                itemHeight={240}
                itemWidth={240}
                data={data}
                renderItem={({ item, index }) => (
                    <View style={{backgroundColor: 'pink', flex: 1}}>
                        <Image width={240} height={200} source={{uri: item.src }} resizeMode="cover" />
                    </View>
                )}
                keyExtractor={(item) => item.key}
                onRearrangeEnd={(e) => console.log('New Arrangement', e)}
                contentContainerPadding={{left: 30, right: 30}}
            />
        </ScrollView>
        </GestureHandlerRootView>
    )
}