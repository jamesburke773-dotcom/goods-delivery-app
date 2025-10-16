import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App(){
  const [orders, setOrders] = useState([]);
  useEffect(()=> {
    async function load() {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/orders', { headers: { Authorization: 'Bearer ADMIN_TOKEN' }});
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  },[]);
  return (
    <div style={{padding:20}}>
      <h1>Admin Dashboard (Demo)</h1>
      <h2>Orders</h2>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Customer</th><th>Status</th><th>Price</th></tr></thead>
        <tbody>
          {orders.map(o=>(
            <tr key={o.id}><td>{o.id}</td><td>{o.customer_id}</td><td>{o.status}</td><td>{o.price_cents}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
