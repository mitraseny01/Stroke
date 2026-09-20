const mongoose = require('mongoose');

/**
 * A ConnectionRequest is the core "search -> select -> request -> respond"
 * object that links a patient/caregiver (User) to a Provider. This is the
 * MVP's equivalent of an Uber/Ola "ride request": the patient initiates it,
 * the provider accepts/rejects/responds, and a simple message thread tracks
 * the back-and-forth.
 */
const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['patient', 'provider'], required: true },
    text: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const connectionRequestSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    patientName: { type: String, required: true }, // denormalized for quick provider-side display
    serviceNeeded: { type: String, required: true },
    note: { type: String }, // free-text description of the patient's situation/need
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
      default: 'Pending',
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);
