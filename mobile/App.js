import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OrderCreate from './screens/OrderCreate';
import OrderTracking from './screens/OrderTracking';
import CourierHome from './screens/CourierHome';

const Stack = createStackNavigator();
export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OrderCreate">
        <Stack.Screen name="OrderCreate" component={OrderCreate} />
        <Stack.Screen name="OrderTracking" component={OrderTracking} />
        <Stack.Screen name="CourierHome" component={CourierHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
