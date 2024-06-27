import React from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { Canvas, Circle, Group, Blur, ColorShader, Rect } from "@shopify/react-native-skia";
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const SkiaTest = () => {

    return (
        <ScrollView>
            <View>
                <Canvas style={{width: '100%', height: 300}}>
                    <Group blendMode="multiply">
                        <Circle cx={100} cy={100} r={100} color="cyan" />
                        <Circle cx={200} cy={100} r={100} color="magenta" />
                        <Circle cx={150} cy={200} r={100} color="yellow" />
                    </Group>
                </Canvas>
            </View>
            <View style={{paddingHorizontal: 10}}>
                <Text>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                </Text>
                <View style={{position: 'absolute', alignSelf: 'center', width: 400, height: 200}}>
                    <Canvas style={StyleSheet.absoluteFill}>
                        <Group blendMode="clear">
                            <Rect x={0} y={0} width={300} height={300}>
                                {/* <ColorShader  color="lightBlue" /> */}
                                <Blur blur={4} />
                            </Rect>
                        </Group>
                    </Canvas>
                </View>
            </View>
        </ScrollView>
    )
}

export default SkiaTest;
