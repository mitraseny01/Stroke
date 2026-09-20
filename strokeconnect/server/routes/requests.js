const express = require('express');
const ConnectionRequest = require('../models/ConnectionRequest');
const Provider = require('../models/Provider');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * PATIENT SIDE
 */

// Create a new request ("Send Request" / "Contact Provider")
router.post('/', requireAuth, requireRole('patient'), async (req, res) => {
  try {
    const { providerId, serviceNeeded, note } = req.body;
    if (!providerId || !serviceNeeded) {
      return res.status(400).json({ message: 'providerId and serviceNeeded are required' });
    }
    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    const user = await User.findById(req.user.id);

    const request = await ConnectionRequest.create({
      patient: user._id,
      provider: provider._id,
      patientName: user.name,
      serviceNeeded,
      note,
      messages: note ? [{ sender: 'patient', text: note }] : [],
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Could not create request', error: err.message });
  }
});

// Patient views their own requests, with provider details populated
router.get('/mine', requireAuth, requireRole('patient'), async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ patient: req.user.id })
      .populate('provider', 'name type city phone email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch requests', error: err.message });
  }
});

/**
 * PROVIDER SIDE
 */

// Provider views incoming requests for their own listing
router.get('/incoming', requireAuth, requireRole('provider'), async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ provider: req.user.id })
      .populate('patient', 'name phone email city')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch requests', error: err.message });
  }
});

// Provider accepts/rejects/completes a request
router.patch('/:id/status', requireAuth, requireRole('provider'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'status must be Accepted, Rejected or Completed' });
    }
    const request = await ConnectionRequest.findOne({ _id: req.params.id, provider: req.user.id });
    if (!request) return res.status(404).json({ message: 'Request not found for this provider' });

    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

/**
 * SHARED: simple message thread on a request (basic two-way communication)
 * sender is inferred from which role is authenticated.
 */
router.post('/:id/messages', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'text is required' });

    const query =
      req.user.role === 'provider'
        ? { _id: req.params.id, provider: req.user.id }
        : { _id: req.params.id, patient: req.user.id };

    const request = await ConnectionRequest.findOne(query);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.messages.push({ sender: req.user.role === 'provider' ? 'provider' : 'patient', text });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Could not send message', error: err.message });
  }
});

module.exports = router;
