const mongoose = require('mongoose');

/**
 * A Provider represents a hospital, clinic, rehab centre, or an individual
 * doctor offering stroke-related services. Providers can log in (optional
 * password field) to manage incoming patient requests from their dashboard.
 */
const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Hospital', 'Clinic', 'Rehabilitation Centre', 'Doctor'],
      required: true,
    },
    services: [
      {
        type: String,
        enum: [
          'Diagnosis',
          'Emergency / Acute Treatment',
          'Thrombolysis',
          'Neurosurgery',
          'Rehabilitation',
          'Physiotherapy',
          'Speech Therapy',
          'Follow-up / OPD Consultation',
        ],
      },
    ],
    specialization: { type: String, default: 'Neurology / Stroke Care' },
    city: { type: String, required: true }, // e.g. Chandigarh, Mohali, Ludhiana
    state: { type: String, required: true, enum: ['Chandigarh', 'Punjab'] },
    address: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    // Optional login for the provider's own dashboard
    password: { type: String, select: false },
    isClaimed: { type: Boolean, default: false }, // true once a provider account logs in / claims this listing
    availability: { type: String, default: 'Contact for availability' },
    notes: { type: String }, // e.g. "24x7 Stroke Helpline", accreditations
    source: { type: String, default: 'Publicly available information (see README Assumptions & Scope)' },
  },
  { timestamps: true }
);

providerSchema.index({ city: 'text', name: 'text', services: 'text' });

module.exports = mongoose.model('Provider', providerSchema);
