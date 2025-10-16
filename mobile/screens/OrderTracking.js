import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import io from 'socket.io-client';

export default function OrderTracking({ route }) {
  const { orderId } = route.params;
  const [loc, setLoc] = useState(null);

  useEffect(()=>{
    const socket = io('http://10.0.2.2:3000', { transports: ['websocket'] });
    socket.emit('joinOrder', { orderId });
    socket.on('location_update', (data) => setLoc(data));
    return ()=> socket.disconnect();
  },[orderId]);

  return (
    <View style={{padding:20}}>
      <Text>Tracking order: {orderId}</Text>
      <Text>{loc ? `Lat: ${loc.lat} Lng: ${loc.lng}` : 'Waiting for courier...'}</Text>
    </View>
  );
}
