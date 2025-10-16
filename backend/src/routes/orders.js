const express = require('express');
const router = express.Router();
const db = require('../models/db');
const jwtAuth = require('../middleware/jwtAuth');

// Create order
router.post('/', jwtAuth, async (req, res) => {
  try {
    const { pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, price_cents } = req.body;
    const q = `INSERT INTO orders (customer_id,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,status,price_cents) VALUES ($1,$2,$3,$4,$5,$6,$7,'created',$8) RETURNING *`;
    const r = await db.query(q, [req.user.id,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,price_cents]);
    const order = r.rows[0];
    // In production: enqueue offer jobs to couriers here
    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Accept order
router.post('/:id/accept', jwtAuth, async (req, res) => {
  try {
    if (req.user.role !== 'courier') return res.status(403).json({ error: 'Only couriers can accept' });
    const orderId = req.params.id;
    const q = `UPDATE orders SET courier_id=$1, status='assigned', updated_at=now() WHERE id=$2 AND status='created' RETURNING *`;
    const r = await db.query(q, [req.user.id, orderId]);
    if (!r.rows[0]) return res.status(400).json({ error: 'Already assigned or invalid' });
    res.json({ order: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Update status
router.post('/:id/status', jwtAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const allowed = ['picked_up','en_route','delivered','cancelled','arrived_pickup','arrived_dropoff'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const q = `UPDATE orders SET status=$1, updated_at=now() WHERE id=$2 AND (courier_id=$3 OR $4::text='admin') RETURNING *`;
    const r = await db.query(q, [status, orderId, req.user.id, req.user.role]);
    if (!r.rows[0]) return res.status(400).json({ error: 'Invalid update or not permitted' });
    res.json({ order: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
