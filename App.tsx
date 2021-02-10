import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

// different screens

const Stack = createStackNavigator()

const RootStack = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="home" component={() => {
        return (
          <SafeAreaView>
            <View>
              <Text>gjfbgvbfuhb</Text>
            </View>
          </SafeAreaView>
        );
      }} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
