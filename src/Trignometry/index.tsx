import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Svg, {G, Circle, Line} from 'react-native-svg';
import { useLoop, mix, polar2Canvas } from 'react-native-redash';
import Animated, { add } from 'react-native-reanimated';

const smallRadius = 10;
const radius = (Dimensions.get('screen').width / 2);
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const numCircle = 20;
const circleArray = new Array(numCircle).fill(numCircle);
const delta = Math.PI / numCircle;

const Trignometry = () => {
    const progress = useLoop(4000, false);
    const theta = mix(progress, 0, 2 * Math.PI);
    const center = {x: radius, y: radius};
    const {x, y} = polar2Canvas({ theta, radius}, center);
    return (
        <View style={{
        ...StyleSheet.absoluteFill,
        backgroundColor: 'black',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        }}>
            <Svg {...{width, height}}>
                <G transform={`translate(0, ${radius})`}  stroke="white">
                  <Circle cx={radius} cy={radius} r={radius} fill="transparent" strokeWidth={2} />
                  {
                    circleArray.map((_, index) => {
                        const {x} = polar2Canvas({theta: add(theta, delta*index), radius}, center)
                        return (
                            <G rotation={(delta*index)*57.2958} origin={radius}>
                                <Line x1={0} y1={radius} x2={radius * 2} y2={radius} />
                                <AnimatedCircle r={smallRadius} cx={x} cy={radius} fill="blue" />
                            </G>
                        );
                     })
                  }
                  <AnimatedCircle r={smallRadius} cx={x} cy={y} fill="red" />
                </G>
            </Svg>
        </View>
    )
}

export default Trignometry;
