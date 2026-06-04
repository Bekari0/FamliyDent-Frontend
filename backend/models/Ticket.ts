import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
 ticketId: { type: String, unique: true, required: true },
 patientId: { type: String, ref: 'User', required: true },
 patientName: String,
 patientPhone: String,
 chatId: { type: Number, required: true },
 
 status: { 
 type: String, 
 enum: ['new', 'open', 'in_progress', 'waiting', 'closed'], 
 default: 'new' 
 },
 priority: { 
 type: String, 
 enum: ['low', 'normal', 'high', 'emergency'], 
 default: 'normal' 
 },
 
 messages: [{
 role: { type: String, enum: ['patient', 'operator', 'system'] },
 text: String,
 operatorName: String,
 timestamp: { type: Date, default: Date.now }
 }],
 
 operatorId: String,
 operatorName: String,
 operatorJoinedAt: Date,
 closedAt: Date,
 closedBy: String,
 
 createdAt: { type: Date, default: Date.now },
 lastActivity: { type: Date, default: Date.now }
});

TicketSchema.index({ status: 1, createdAt: -1 });
TicketSchema.index({ patientId: 1 });

export const Ticket = (mongoose.models.Ticket ||
 mongoose.model('Ticket', TicketSchema)) as mongoose.Model<any>;
