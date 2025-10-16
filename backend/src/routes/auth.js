const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });
    const hashed = await bcrypt.hash(password, 10);
    const q = `INSERT INTO users (name,email,phone,password_hash,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,role`;
    const r = await db.query(q, [name,email,phone,hashed,role||'customer']);
    const user = r.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const r = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = r.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
