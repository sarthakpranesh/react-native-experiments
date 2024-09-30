import React from 'react'
import { StyleSheet, View } from 'react-native'
import StarBackgroundWithGradient from '../components/StarBackgroundWithGradient'

export default function Page () {
    return (
        <View style={[StyleSheet.absoluteFill]}>
            <StarBackgroundWithGradient />
        </View>
    )
}