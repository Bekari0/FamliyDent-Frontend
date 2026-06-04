import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
 _id: { type: String, required: true },
 name: { type: String, required: true },
 slug: { type: String, unique: true, sparse: true, index: true },
 email: { type: String, required: true, unique: true },
 specialty: { type: String, required: true },
 experience: String,
 image: String,
 rating: { type: Number, default: 0 },
 reviewsCount: { type: Number, default: 0 },
 description: String,
 education: [String],
 achievements: [String],
 userId: { type: String, ref: 'User' }
}, {
 toJSON: {
 virtuals: true,
 versionKey: false,
 transform: (doc, ret: any) => { ret.id = ret._id; }
 }
});

export const Doctor = (mongoose.models.Doctor ||
 mongoose.model('Doctor', DoctorSchema)) as mongoose.Model<any>;
