import mongoose, { Schema, Document } from 'mongoose';

export interface IScan extends Document {
 patientId: string;
 doctorId: string;
 imageUrl: string;
 originalName?: string;
 mimeType?: string;
 size?: number;
 description: string;
 type: 'x-ray' | 'photo' | 'panorama' | 'pdf';
 createdAt: Date;
}

const ScanSchema: Schema = new Schema({
 _id: { type: String, default: () => `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
 patientId: { type: String, required: true },
 doctorId: { type: String, required: true },
 imageUrl: { type: String, required: true },
 originalName: { type: String },
 mimeType: { type: String },
 size: { type: Number },
 description: { type: String },
 type: { type: String, enum: ['x-ray', 'photo', 'panorama', 'pdf'], default: 'x-ray' },
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

export default mongoose.model<IScan>('Scan', ScanSchema);
