const express = require('express');
const router = express.Router();
const db = require('../models/db');
const jwtAuth = require('../middleware/jwtAuth');

router.post('/:id/location', jwtAuth, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const courierId = req.params.id;
    // upsert courier location
    const q = `INSERT INTO courier_locations (courier_id,lat,lng,updated_at) VALUES ($1,$2,$3,now())
               ON CONFLICT (courier_id) DO UPDATE SET lat=EXCLUDED.lat, lng=EXCLUDED.lng, updated_at=now()`;
    await db.query(q, [courierId, lat, lng]);
    // optional: publish to socket/Redis
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
