const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/couriers', require('./routes/couriers'));

// socket.io
io.on('connection', (socket) => {
  socket.on('joinOrder', ({ orderId }) => socket.join(`order_${orderId}`));
  socket.on('leaveOrder', ({ orderId }) => socket.leave(`order_${orderId}`));
  socket.on('courierLocation', ({ orderId, lat, lng }) => {
    io.to(`order_${orderId}`).emit('location_update', { lat, lng, ts: Date.now() });
  });
});

// graceful start
server.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});
