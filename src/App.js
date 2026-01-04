import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import Books from './screens/Books';
import Chapters from './screens/Chapters';
import Verses from './screens/Verses';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Books"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#f5f5f5' },
          }}
        >
          <Stack.Screen name="Books" component={Books} />
          <Stack.Screen name="Chapters" component={Chapters} />
          <Stack.Screen name="Verses" component={Verses} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
          } 
