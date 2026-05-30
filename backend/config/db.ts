import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as UserModel } from '../models/User';

const User = UserModel as any;

export const connectDB = async () => {
 const MONGODB_URI = process.env.MONGODB_URI;

 if (!MONGODB_URI) {
 console.warn('WARNING: MONGODB_URI environment variable is not defined.');
 return;
 }

 try {
 await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
 console.log('Connected to MongoDB');

 if (process.env.SEED_DB === 'true') {
 await seedDB();
 }
 } catch (err) {
 console.error('MongoDB connection error:', err);
 }
};

const seedDB = async () => {
 try {
 await seedAdminFromEnv();
 } catch (error) {
 console.error('Seeding error:', error);
 }
};

const seedAdminFromEnv = async () => {
 const adminEmail = process.env.SEED_ADMIN_EMAIL;
 const adminPassword = process.env.SEED_ADMIN_PASSWORD;
 const adminName = process.env.SEED_ADMIN_NAME || 'Administrator';

 if (!adminEmail || !adminPassword) {
 console.warn('Skipping admin seed: SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD is missing.');
 return;
 }

 const existingAdmin = await User.findOne({ email: adminEmail });
 if (existingAdmin) {
 if (!existingAdmin.uid) {
 await User.updateOne(
 { email: adminEmail },
 {
 $set: {
 uid: existingAdmin._id.toString(),
 emailVerified: true,
 isEmailVerified: true
 }
 }
 );
 }
 return;
 }

 const hashedPassword = await bcrypt.hash(adminPassword, 12);
 const adminId = `admin-${Date.now()}`;

 await User.create({
 _id: adminId,
 uid: adminId,
 email: adminEmail,
 password: hashedPassword,
 displayName: adminName,
 role: 'admin',
 emailVerified: true,
 isEmailVerified: true,
 createdAt: new Date()
 });

 console.log(`Admin user seeded: ${adminEmail}`);
};
