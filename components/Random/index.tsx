import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import AnimatedRacingBorderView from './AnimatedRacingBorderView'

const Random = () => {
    return (
        <ScrollView style={StyleSheet.absoluteFill}>
            <View style={st.p12}>
                <AnimatedRacingBorderView borderWidth={4} duration={4000} borderColorBackground='red' borderColorForeground='yellow' borderAnimationWidth={50} loop={3} way='clockwise'>
                    <View style={st.greenBox} />
                </AnimatedRacingBorderView>
            </View>
            <View style={st.p12}>
                <AnimatedRacingBorderView borderWidth={4} duration={4000} borderColorBackground='red' borderColorForeground='yellow' borderAnimationWidth={50} loop={3} way='clockwise'>
                    <View style={st.yellowBox} />
                </AnimatedRacingBorderView>
            </View>
            <View style={st.p12}>
                <AnimatedRacingBorderView borderWidth={4} duration={4000} borderColorBackground='red' borderColorForeground='yellow' borderAnimationWidth={50} loop={3} way='clockwise'>
                    <View style={st.blueBox} />
                </AnimatedRacingBorderView>
            </View>
        </ScrollView>
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
    },
    yellowBox: {
        width: 300,
        height: 100,
        backgroundColor: 'yellow'
    },
    blueBox: {
        width: 100,
        height: 300,
        backgroundColor: 'blue'
    }
})

export default Random