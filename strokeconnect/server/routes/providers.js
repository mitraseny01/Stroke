const express = require('express');
const Provider = require('../models/Provider');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/providers
 * Public search. Query params:
 *   city     - e.g. "Chandigarh", "Mohali", "Ludhiana"
 *   service  - e.g. "Rehabilitation", "Emergency / Acute Treatment"
 *   type     - "Hospital" | "Clinic" | "Rehabilitation Centre" | "Doctor"
 *   q        - free text search (name/city/services)
 */
router.get('/', async (req, res) => {
  try {
    const { city, service, type, q } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(`^${city}$`, 'i');
    if (service) filter.services = service;
    if (type) filter.type = type;
    if (q) filter.$text = { $search: q };

    const providers = await Provider.find(filter).sort({ name: 1 });
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

// Distinct city list, used to populate the search filter dropdown
router.get('/meta/cities', async (req, res) => {
  const cities = await Provider.distinct('city');
  res.json(cities.sort());
});

router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (err) {
    res.status(400).json({ message: 'Invalid provider id' });
  }
});

// Provider updates their own listing (availability/notes) once logged in
router.patch('/me', requireAuth, requireRole('provider'), async (req, res) => {
  try {
    const { availability, notes, phone } = req.body;
    const provider = await Provider.findByIdAndUpdate(
      req.user.id,
      { $set: { ...(availability && { availability }), ...(notes && { notes }), ...(phone && { phone }) } },
      { new: true }
    );
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;
