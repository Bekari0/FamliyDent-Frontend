import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
 _id: { type: String, required: true },
 patientId: { type: String, required: true, index: true },
 appointmentId: { type: String, required: true, index: true },
 patientName: String,
 doctorId: String,
 doctorName: String,
 rating: { type: Number, required: true, min: 1, max: 5 },
 text: { type: String, required: true, trim: true },
 comment: { type: String, trim: true },
 status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
 moderatedAt: Date,
 moderatedBy: String
}, {
 timestamps: true,
 toJSON: {
 virtuals: true,
 versionKey: false,
 transform: (_doc, ret: any) => {
 ret.id = ret._id;
 if (!ret.text && ret.comment) ret.text = ret.comment;
 }
 }
});

export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
