import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema({
 _id: { type: String, default: () => `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
 patientId: { type: String, required: true },
 doctorId: { type: String },
 procedureTitle: { type: String, required: true },
 details: { type: String, required: true },
 toothNumber: { type: String },
 price: { type: Number, default: 0 },
 date: { type: Date, default: Date.now },
 files: [String],
 createdAt: { type: Date, default: Date.now }
}, {
 toJSON: {
 virtuals: true,
 versionKey: false,
 transform: (doc, ret: any) => { 
 ret.id = ret._id; 
 ret.uid = ret._id; 
 }
 }
});

export const MedicalRecord = mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', MedicalRecordSchema);
