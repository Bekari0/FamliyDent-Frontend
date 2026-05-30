import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
 _id: { type: String, required: true },
 uid: { type: String }, // Optional if _id is used, but keeping for compatibility
 email: { type: String, required: true, unique: true },
 password: { type: String }, // Hashed password for local auth
 displayName: String,
 role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
 phoneNumber: String,
 telegramId: { type: Number, unique: true, sparse: true },
 lastLoginAt: Date,
 gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
 birthDate: String,
 photoURL: String,
 doctorId: { type: String, ref: 'Doctor' },
 isEmailVerified: { type: Boolean, default: false },
 emailVerified: { type: Boolean, default: false },
 verificationCode: String,
 verificationCodeExpires: Date,
 emailVerificationCodeHash: String,
 emailVerificationExpires: Date,
 emailVerificationAttempts: { type: Number, default: 0 },
 emailVerificationLastSentAt: Date,
 lastEmailVerificationSentAt: Date,
 resetPasswordToken: String,
 resetPasswordExpires: Date,
 notificationSettings: {
 email: { type: Boolean, default: true },
 bookingUpdates: { type: Boolean, default: true },
 appointmentReminders: { type: Boolean, default: true },
 cancellations: { type: Boolean, default: true },
 news: { type: Boolean, default: false },
 },
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}, {
 timestamps: true,
 toJSON: {
 virtuals: true,
 versionKey: false,
 transform: (doc, ret: any) => { 
 ret.id = ret._id;
 ret.uid = ret.uid || ret._id;
 ret.emailVerified = Boolean(ret.emailVerified || ret.isEmailVerified);
 delete ret.password;
 delete ret.emailVerificationCodeHash;
 delete ret.emailVerificationExpires;
 delete ret.emailVerificationAttempts;
 delete ret.emailVerificationLastSentAt;
 delete ret.lastEmailVerificationSentAt;
 delete ret.verificationCode;
 delete ret.verificationCodeExpires;
 delete ret.resetPasswordToken;
 delete ret.resetPasswordExpires;
 }
 }
});

// UserSchema.pre('save', function(next) {
// if (this._id && !this.uid) {
// this.uid = this._id as string;
// }
// next();
// });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
