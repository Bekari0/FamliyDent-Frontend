import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
 category: { type: String, required: true },
 services: [String]
});

export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
