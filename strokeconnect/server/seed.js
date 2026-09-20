/**
 * Seeds the database with an initial stroke-care provider dataset for
 * Chandigarh & Punjab, compiled from publicly available hospital/department
 * information (official hospital pages, stroke-network directories, and
 * news coverage). See README "Assumptions & Scope" — this is a starting
 * dataset for the MVP demo, not an exhaustive or verified directory, and
 * should be expanded/confirmed with each provider before production use.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Provider = require('./models/Provider');

const providers = [
  {
    name: 'PGIMER Chandigarh — Department of Neurology',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Thrombolysis', 'Neurosurgery', 'Follow-up / OPD Consultation'],
    specialization: 'Neurology, Stroke & Neurosonology (runs a dedicated PGI Stroke Programme)',
    city: 'Chandigarh',
    state: 'Chandigarh',
    address: 'Post Graduate Institute of Medical Education & Research, Sector 12, Chandigarh, 160012',
    phone: '0172-2756565',
    website: 'https://pgimer.edu.in',
    availability: 'OPD on weekdays; 24x7 emergency',
    notes: 'Premier government tertiary-care institute; established stroke programme and neurosonology lab; helped set up stroke programmes for Punjab & Haryana govts.',
  },
  {
    name: 'Government Medical College & Hospital (GMCH-32), Chandigarh — Neurology',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Follow-up / OPD Consultation'],
    specialization: 'General Medicine / Neurology',
    city: 'Chandigarh',
    state: 'Chandigarh',
    address: 'Sector 32, Chandigarh, 160030',
    phone: '0172-2665253',
    availability: 'OPD on weekdays; 24x7 emergency',
    notes: 'Government multi-speciality hospital; affordable care option.',
  },
  {
    name: 'Fortis Hospital Mohali — Stroke & Neurosciences',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Thrombolysis', 'Neurosurgery', 'Rehabilitation', 'Follow-up / OPD Consultation'],
    specialization: "Comprehensive Stroke Centre — region's only Biplane Neuro Cath Lab, mechanical thrombectomy",
    city: 'Mohali',
    state: 'Punjab',
    address: 'Sector 62, Phase 8, SAS Nagar, Mohali, 160062',
    phone: '98720 22222 (24x7 Stroke Helpline)',
    website: 'https://www.fortishealthcare.com',
    availability: '24x7 acute stroke care',
    notes: 'Part of the official Angels Initiative stroke network; advanced interventional neuroradiology team.',
  },
  {
    name: 'Max Super Speciality Hospital, Mohali — Neurosciences',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Thrombolysis', 'Neurosurgery', 'Follow-up / OPD Consultation'],
    specialization: 'Neurosciences / Stroke',
    city: 'Mohali',
    state: 'Punjab',
    address: 'Phase 6, Near Civil Hospital, SAS Nagar, Mohali, 160055',
    phone: '0172-5212666 / 77107-77107; Brain Attack: +91 9910204023',
    website: 'https://www.maxhealthcare.in',
    availability: '24x7',
    notes: 'Angels Initiative Gold/Diamond award stroke-ready hospital; part of official stroke network.',
  },
  {
    name: 'Civil Hospital, Mohali',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Follow-up / OPD Consultation'],
    specialization: 'General / Stroke stabilisation',
    city: 'Mohali',
    state: 'Punjab',
    address: 'SAS Nagar, Mohali, 160055',
    availability: '24x7 emergency',
    notes: 'Government hospital; part of the official stroke referral network (Angels Initiative).',
  },
  {
    name: 'Dr. B. R. Ambedkar State Institute of Medical Sciences (AIMS), Mohali',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Follow-up / OPD Consultation'],
    specialization: 'Government tertiary care',
    city: 'Mohali',
    state: 'Punjab',
    address: 'Sahibzada Ajit Singh Nagar, Mohali, 160055',
    availability: '24x7 emergency',
    notes: 'Part of the official stroke network (Angels Initiative), Primary Stroke Centre.',
  },
  {
    name: 'IVY Hospital, Mohali',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Rehabilitation', 'Follow-up / OPD Consultation'],
    specialization: 'Multi-speciality with Neurology',
    city: 'Mohali',
    state: 'Punjab',
    address: 'Sector 71, Mohali, 160071',
    availability: 'OPD: 8:00 AM – 4:00 PM; 24x7 emergency',
    notes: '80-bed multi-speciality hospital.',
  },
  {
    name: 'Christian Medical College & Hospital (CMC), Ludhiana — Department of Neurology',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Thrombolysis', 'Neurosurgery', 'Rehabilitation', 'Follow-up / OPD Consultation'],
    specialization: "India's first WSO- & NABH-certified Advanced/Comprehensive Stroke Centre",
    city: 'Ludhiana',
    state: 'Punjab',
    address: 'Brown Road, Ludhiana, 141008',
    website: 'https://www.cmcludhiana.in',
    availability: '24x7 acute stroke unit',
    notes: 'Designated "Hub" of the Punjab Govt–CMC–Medtronic Hub-and-Spoke stroke care model launched in 2024; runs Ludhiana population-based stroke registry.',
  },
  {
    name: 'Dayanand Medical College & Hospital (DMCH), Ludhiana — Department of Neurology',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Thrombolysis', 'Follow-up / OPD Consultation'],
    specialization: 'Neurology',
    city: 'Ludhiana',
    state: 'Punjab',
    address: 'Civil Lines, Ludhiana, 141001',
    website: 'https://www.dmch.in',
    availability: 'OPD on weekdays; 24x7 emergency',
    notes: 'Major private teaching hospital in Ludhiana with an established neurology department.',
  },
  {
    name: 'Government Medical College & Rajindra Hospital, Patiala — Neurology',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Follow-up / OPD Consultation'],
    specialization: 'General Medicine / Neurology',
    city: 'Patiala',
    state: 'Punjab',
    address: 'Kot Fatoohi Road, Patiala, 147001',
    availability: 'OPD on weekdays; 24x7 emergency',
    notes: 'Government tertiary-care hospital; likely acts as a "spoke" referral centre for advanced stroke care.',
  },
  {
    name: 'Government Medical College, Amritsar — Neurology',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Follow-up / OPD Consultation'],
    specialization: 'General Medicine / Neurology',
    city: 'Amritsar',
    state: 'Punjab',
    address: 'Circular Road, Amritsar, 143001',
    availability: 'OPD on weekdays; 24x7 emergency',
    notes: 'Government tertiary-care hospital serving the Amritsar region.',
  },
  {
    name: 'Alchemist Hospital, Panchkula — Neurology',
    type: 'Hospital',
    services: ['Diagnosis', 'Emergency / Acute Treatment', 'Rehabilitation', 'Follow-up / OPD Consultation'],
    specialization: 'Multi-speciality with Neurology & Physiotherapy',
    city: 'Panchkula',
    state: 'Punjab',
    address: 'Sector 25, Panchkula, 134116',
    availability: 'OPD on weekdays; 24x7 emergency',
    notes: 'Tri-city area hospital, commonly used alongside Chandigarh/Mohali facilities.',
  },
  {
    name: 'NeuroPhysio Rehab & Physiotherapy Centre',
    type: 'Rehabilitation Centre',
    services: ['Rehabilitation', 'Physiotherapy', 'Speech Therapy'],
    specialization: 'Post-stroke physical & speech rehabilitation',
    city: 'Chandigarh',
    state: 'Chandigarh',
    address: 'Sector 22, Chandigarh, 160022',
    availability: 'By appointment',
    notes: 'Representative independent rehab-centre listing — confirm live contact details before publishing (see README).',
  },
  {
    name: 'Dr. Dheeraj Khurana — Neurology & Stroke Consultant',
    type: 'Doctor',
    services: ['Diagnosis', 'Follow-up / OPD Consultation'],
    specialization: 'Professor of Neurology, PGIMER Chandigarh; acute stroke, neurosonology',
    city: 'Chandigarh',
    state: 'Chandigarh',
    address: 'PGIMER, Sector 12, Chandigarh, 160012',
    availability: 'PGIMER OPD hours',
    notes: 'Helped establish the PGI stroke programme; mentored Punjab & Haryana govt stroke programmes.',
  },
];

async function seed() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/strokeconnect';
  await mongoose.connect(MONGO_URI);
  console.log('Connected. Clearing existing providers...');
  await Provider.deleteMany({});
  await Provider.insertMany(providers);
  console.log(`Seeded ${providers.length} providers.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
