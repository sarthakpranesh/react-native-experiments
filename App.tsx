import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// different screens
import AnimatedCube from './src/AnimatedCube';
import Trignometry from './src/Trignometry/index.tsx';


export default function App() {
  return (
    <Trignometry />
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
