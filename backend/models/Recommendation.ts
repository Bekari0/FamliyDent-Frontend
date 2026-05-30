import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
 patientId: string;
 doctorId: string;
 content: string;
 nextVisitDate?: string;
 isCompleted: boolean;
 createdAt: Date;
}

const RecommendationSchema: Schema = new Schema({
 _id: { type: String, default: () => `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
 patientId: { type: String, required: true },
 doctorId: { type: String, required: true },
 content: { type: String, required: true },
 nextVisitDate: { type: String },
 isCompleted: { type: Boolean, default: false },
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

export default mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
