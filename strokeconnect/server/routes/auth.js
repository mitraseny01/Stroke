const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Provider = require('../models/Provider');

const router = express.Router();

function signToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

/**
 * PATIENT / CAREGIVER AUTH
 */
router.post('/patient/register', async (req, res) => {
  try {
    const { name, email, password, phone, city, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone,
      city,
      role: role === 'patient' ? 'patient' : 'caregiver',
    });

    const token = signToken(user._id, 'patient'); // 'patient' role bucket covers patient+caregiver accounts
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

router.post('/patient/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(user._id, 'patient');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

/**
 * PROVIDER AUTH
 * Providers are seeded from public data (see seed.js). To keep the MVP
 * simple, a provider "claims" their listing by setting a password the first
 * time they log in with their registered email — no separate signup screen
 * needed for the demo dataset.
 */
router.post('/provider/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

    const provider = await Provider.findOne({ email: email.toLowerCase() }).select('+password');
    if (!provider) return res.status(404).json({ message: 'No provider listing found with this email' });

    if (!provider.password) {
      // First login: claim the account by setting the password
      provider.password = await bcrypt.hash(password, 10);
      provider.isClaimed = true;
      await provider.save();
    } else {
      const match = await bcrypt.compare(password, provider.password);
      if (!match) return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(provider._id, 'provider');
    res.json({
      token,
      provider: { id: provider._id, name: provider.name, email: provider.email, city: provider.city },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
