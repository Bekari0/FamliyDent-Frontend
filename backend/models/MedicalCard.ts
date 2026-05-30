import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalCard extends Document {
 patientId: string;
 bloodType?: string;
 allergies: string[];
 chronicConditions: string[];
 notes?: string;
 updatedAt: Date;
}

const MedicalCardSchema: Schema = new Schema({
 patientId: { type: String, required: true, unique: true },
 bloodType: { type: String },
 allergies: [{ type: String }],
 chronicConditions: [{ type: String }],
 notes: { type: String },
 updatedAt: { type: Date, default: Date.now }
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

export default mongoose.model<IMedicalCard>('MedicalCard', MedicalCardSchema);
