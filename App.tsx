import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Screens
// Moti experiments and examples
import ViewAnimations from './src/Moti/ViewAnimations/ViewAnimations';
import StarBackground from './src/StarBackground';

// Reanimated experiments

const Stack = createStackNavigator()

const RootStack = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName='star'>
      <Stack.Screen name="home" component={ViewAnimations} />
      <Stack.Screen name="star" component={StarBackground} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack/>
    </NavigationContainer>
  );
}
