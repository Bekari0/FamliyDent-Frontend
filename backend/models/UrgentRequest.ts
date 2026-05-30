import mongoose from 'mongoose';

const UrgentRequestSchema = new mongoose.Schema({
 name: { type: String, required: true },
 phone: { type: String, required: true },
 branch: { type: String },
 reason: { type: String, required: true },
 preferredTime: { type: String },
 status: {
 type: String,
 enum: ['new', 'in_progress', 'closed'],
 default: 'new'
 },
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}, {
 timestamps: true,
 toJSON: {
 virtuals: true,
 versionKey: false,
 transform: (_doc, ret: any) => {
 ret.id = ret._id;
 }
 }
});

export const UrgentRequest = mongoose.models.UrgentRequest || mongoose.model('UrgentRequest', UrgentRequestSchema);
