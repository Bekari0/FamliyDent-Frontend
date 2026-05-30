import mongoose from 'mongoose';
import { Doctor } from '../models/Doctor';
import { User } from '../models/User';

const MOJIBAKE_RE = /(?:\u0420[\u0080-\u04ff]|\u0421[\u0080-\u04ff])/;

const toKey = (value: unknown) => String(value || '').trim();

const isUsefulName = (value: unknown) => {
 const text = toKey(value);
 if (!text) return false;
 return text !== 'Врач' && text !== 'Врач не указан' && !MOJIBAKE_RE.test(text);
};

export async function getDoctorNameMap(doctorIds: string[]) {
 const ids = Array.from(new Set(doctorIds.map(toKey).filter(Boolean)));
 if (ids.length === 0) return {};

 const objectIds = ids
 .filter((id) => mongoose.Types.ObjectId.isValid(id))
 .map((id) => new mongoose.Types.ObjectId(id));
 const mixedIds = [...ids, ...objectIds];

 const [doctors, doctorUsers, allDoctors] = await Promise.all([
 (Doctor as any).collection
 .find({
 $or: [
 { _id: { $in: mixedIds } },
 { userId: { $in: mixedIds } },
 { email: { $in: ids } },
 { name: { $in: ids } },
 { fullName: { $in: ids } },
 ],
 })
 .project({ _id: 1, name: 1, fullName: 1, email: 1, userId: 1 })
 .toArray(),
 (User as any).collection
 .find({
 $or: [
 { _id: { $in: mixedIds } },
 { uid: { $in: ids } },
 { doctorId: { $in: mixedIds } },
 { email: { $in: ids } },
 { displayName: { $in: ids } },
 ],
 })
 .project({ _id: 1, uid: 1, displayName: 1, doctorId: 1, email: 1 })
 .toArray(),
 (Doctor as any).collection
 .find({})
 .project({ _id: 1, name: 1, fullName: 1, email: 1, userId: 1 })
 .toArray(),
 ]);

 const names: Record<string, string> = {};
 const doctorsById: Record<string, any> = {};

 const addDoctor = (doctor: any, keys: unknown[]) => {
 const name = doctor?.fullName || doctor?.name;
 if (!isUsefulName(name)) return;
 keys.map(toKey).filter(Boolean).forEach((key) => {
 names[key] = name;
 });
 };

 allDoctors.forEach((doctor: any, index: number) => {
 if (doctor?._id) doctorsById[toKey(doctor._id)] = doctor;
 addDoctor(doctor, [doctor?._id, doctor?.userId, doctor?.email, String(index + 1)]);
 });

 doctors.forEach((doctor: any) => {
 addDoctor(doctor, [doctor?._id, doctor?.userId, doctor?.email, doctor?.name, doctor?.fullName]);
 });

 doctorUsers.forEach((user: any) => {
 const linkedDoctor = user?.doctorId ? doctorsById[toKey(user.doctorId)] : null;
 const name = linkedDoctor?.fullName || linkedDoctor?.name || user?.displayName;
 if (!isUsefulName(name)) return;
 [user?._id, user?.uid, user?.doctorId, user?.email, user?.displayName].map(toKey).filter(Boolean).forEach((key) => {
 names[key] = name;
 });
 });

 ids.forEach((id) => {
 if (!names[id] && isUsefulName(id) && !/^[a-f0-9]{24}$/i.test(id) && !/^dr[-_]/i.test(id)) {
 names[id] = id;
 }
 });

 return names;
}

export async function resolveDoctorName(doctorId?: unknown, fallbackName?: unknown) {
 if (isUsefulName(fallbackName)) return String(fallbackName).trim();
 const id = toKey(doctorId);
 if (!id) return 'Врач не указан';
 const names = await getDoctorNameMap([id]);
 return names[id] || 'Врач не указан';
}
