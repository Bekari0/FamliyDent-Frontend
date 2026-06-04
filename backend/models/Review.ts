import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
 _id: { type: String, required: true },
 patientId: { type: String, required: true, index: true },
 appointmentId: { type: String, required: true, index: true },
 patientName: String,
 authorName: String,
 doctorId: String,
 doctorName: String,
 source: { type: String, enum: ['site', 'google', 'yandex'], default: 'site', index: true },
 externalId: String,
 externalKey: { type: String, unique: true, sparse: true, index: true },
 externalUrl: String,
 sourceUrl: String,
 date: Date,
 importedAt: Date,
 rating: { type: Number, required: true, min: 1, max: 5 },
 text: { type: String, required: true, trim: true },
 comment: { type: String, trim: true },
 moderationStatus: { type: String, enum: ['approved', 'pending', 'rejected'], index: true },
 moderationReason: String,
 moderationScore: Number,
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
 if (!ret.source) ret.source = 'site';
 if (!ret.authorName && ret.patientName) ret.authorName = ret.patientName;
 if (!ret.patientName && ret.authorName) ret.patientName = ret.authorName;
 if (!ret.externalUrl && ret.sourceUrl) ret.externalUrl = ret.sourceUrl;
 if (!ret.moderationStatus) ret.moderationStatus = ret.status || 'approved';
 }
 }
});

export const Review = (mongoose.models.Review ||
 mongoose.model('Review', ReviewSchema)) as mongoose.Model<any>;
