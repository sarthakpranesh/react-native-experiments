import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AnimatedCube from './src/AnimatedCube';


export default function App() {
  return (
    <AnimatedCube />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
