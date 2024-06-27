import React from 'react'
import { StyleSheet, View } from 'react-native'
import CarLoader from '../components/CarLoader'

export default function Page () {
    return (
        <View style={[StyleSheet.absoluteFill]}>
            <CarLoader />
        </View>
    )
}