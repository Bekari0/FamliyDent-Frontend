import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import { User as UserModel } from '../models/User';

const User = UserModel as any;
mongoose.set('bufferCommands', false);

const maskMongoUri = (uri: string) => {
 try {
 const parsed = new URL(uri);
 const auth = parsed.username ? `${parsed.username}:***@` : '';
 return `${parsed.protocol}//${auth}${parsed.host}${parsed.pathname}`;
 } catch {
 return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
 }
};

const logConnectionState = (state: string) => {
 console.log(`[MongoDB] ${state}; readyState=${mongoose.connection.readyState}`);
};

mongoose.connection.on('connecting', () => logConnectionState('connecting'));
mongoose.connection.on('connected', () => logConnectionState('connected'));
mongoose.connection.on('disconnected', () => logConnectionState('disconnected'));
mongoose.connection.on('reconnected', () => logConnectionState('reconnected'));
mongoose.connection.on('error', (err) => {
 console.error('[MongoDB] connection error event:', err.message);
});

export const connectDB = async () => {
 const MONGODB_URI = process.env.MONGODB_URI;

 if (!MONGODB_URI) {
 throw new Error('MONGODB_URI environment variable is not defined.');
 }

 const dnsServers = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
 .split(',')
 .map((server) => server.trim())
 .filter(Boolean);

 if (dnsServers.length > 0) {
 dns.setServers(dnsServers);
 console.log(`[MongoDB] Node DNS servers: ${dnsServers.join(', ')}`);
 }

 console.log(`[MongoDB] Connecting to ${maskMongoUri(MONGODB_URI)}`);

 try {
 await mongoose.connect(MONGODB_URI, {
 serverSelectionTimeoutMS: 15000,
 connectTimeoutMS: 15000,
 socketTimeoutMS: 30000,
 maxPoolSize: 10,
 retryWrites: true,
 });
 console.log(`[MongoDB] Connected: ${mongoose.connection.name || 'default'}`);

 if (process.env.SEED_DB === 'true') {
 await seedDB();
 }
 } catch (err) {
 console.error('[MongoDB] Initial connection failed:', err);
 throw err;
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
