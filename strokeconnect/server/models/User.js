const mongoose = require('mongoose');

/**
 * A User is a patient or caregiver who searches for providers and sends
 * connection requests.
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['patient', 'caregiver'], default: 'caregiver' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    password: { type: String, required: true, select: false },
    city: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
