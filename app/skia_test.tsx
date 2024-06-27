import React from 'react'
import { StyleSheet, View } from 'react-native'
import SkiaTest from '../components/SkiaTest'

export default function Page () {
    return (
        <View style={[StyleSheet.absoluteFill]}>
            <SkiaTest />
        </View>
    )
}