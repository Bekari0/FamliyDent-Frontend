import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
 _id: { type: String, required: true },
 bookingNumber: { type: Number, unique: true },
 patientId: { type: String, required: true, index: true }, 
 doctorId: { type: String, required: true, index: true }, 
 serviceId: { type: String, required: true },
 date: String,
 time: String,
 status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
 createdAt: { type: Date, default: Date.now }
}, {
 toJSON: {
 virtuals: true,
 versionKey: false,
 transform: (doc, ret: any) => { ret.id = ret._id; }
 }
});

// Auto-increment bookingNumber
BookingSchema.pre('save', async function() {
 if (this.isNew) {
 const lastBooking = await (this.constructor as any).findOne({}, {}, { sort: { 'bookingNumber': -1 } });
 this.bookingNumber = lastBooking && lastBooking.bookingNumber ? lastBooking.bookingNumber + 1 : 1;
 }
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
