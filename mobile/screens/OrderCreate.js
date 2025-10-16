import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import axios from 'axios';

export default function OrderCreate({ navigation }){
  const [pickup,setPickup] = useState('');
  const [dropoff,setDropoff] = useState('');
  async function create(){
    try {
      const res = await axios.post('http://10.0.2.2:3000/api/orders', {
        pickup_address: pickup,
        dropoff_address: dropoff,
        price_cents: 1500
      }, { headers: { Authorization: 'Bearer DEMO_TOKEN' }});
      navigation.navigate('OrderTracking', { orderId: res.data.order.id });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create order. Make sure backend is running.');
    }
  }
  return (
    <View style={{padding:16}}>
      <Text>Pickup</Text>
      <TextInput value={pickup} onChangeText={setPickup} placeholder="Pickup address" style={{borderWidth:1,padding:8,marginBottom:8}}/>
      <Text>Dropoff</Text>
      <TextInput value={dropoff} onChangeText={setDropoff} placeholder="Dropoff address" style={{borderWidth:1,padding:8,marginBottom:8}}/>
      <Button title="Request Delivery" onPress={create} />
    </View>
  );
}
