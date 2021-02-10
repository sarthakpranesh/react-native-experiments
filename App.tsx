import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Screens
// Moti experiments and examples
import ViewAnimations from './src/Moti/ViewAnimations/ViewAnimations';

// Reanimated experiments

const Stack = createStackNavigator()

const RootStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="home" component={ViewAnimations} />
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
