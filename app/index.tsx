import React from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { Link } from 'expo-router'

export default function Page () {
    return (
        <View style={StyleSheet.absoluteFill}>
            <Link href='/star' asChild>
                <Pressable>
                    <Text>Star Background</Text>
                </Pressable>
            </Link>
            <Link href='/car_animation' asChild>
                <Pressable>
                    <Text>Car Animation</Text>
                </Pressable>
            </Link>
            <Link href='/skia_test' asChild>
                <Pressable>
                    <Text>Skia test</Text>
                </Pressable>
            </Link>
        </View>
    )
}