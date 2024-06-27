import React from 'react'
import { StyleSheet, View } from 'react-native'
import StarBackground from '../components/StarBackground'

export default function Page () {
    return (
        <View style={[StyleSheet.absoluteFill]}>
            <StarBackground />
        </View>
    )
}