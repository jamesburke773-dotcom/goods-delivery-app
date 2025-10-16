import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import axios from 'axios';

export default function CourierHome(){
  async function simulateAccept(){
    try {
      const orderId = 'replace-with-order-id';
      await axios.post(`http://10.0.2.2:3000/api/orders/${orderId}/accept`, {}, { headers: { Authorization: 'Bearer COURIER_TOKEN'}});
      Alert.alert('Accepted', 'Simulated acceptance');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Make sure backend is running and order exists.');
    }
  }

  return (
    <View style={{padding:20}}>
      <Text>Courier Home (demo)</Text>
      <Button title="Simulate Accept Job" onPress={simulateAccept} />
    </View>
  );
}
