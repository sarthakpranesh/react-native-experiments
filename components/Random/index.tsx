import React from 'react'
import { StyleSheet, View } from 'react-native'
import AnimatedRacingBorderView from './AnimatedRacingBorderView'

const Random = () => {
    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={st.p12}>
                <AnimatedRacingBorderView borderWidth={4} duration={2000} borderColorBackground='red' borderColorForeground='yellow' borderAnimationWidth={50} loop={3} way='clockwise'>
                    <View style={st.greenBox} />
                </AnimatedRacingBorderView>
            </View>
        </View>
    )
}

const st  = StyleSheet.create({
    p12: {
        padding: 12
    },
    greenBox: {
        width: 300,
        height: 300,
        backgroundColor: 'green'
    }
})

export default Random