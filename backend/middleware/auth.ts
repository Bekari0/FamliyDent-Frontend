import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User as UserModel } from '../models/User';

const User = UserModel as any;
const JWT_SECRET = process.env.JWT_SECRET || 'family-dent-secret-key-2024';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
 const token = req.cookies.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
 
 if (!token) {
 return res.status(401).json({ error: 'Не авторизован' });
 }

 try {
 const decoded = jwt.verify(token, JWT_SECRET) as any;
 const user = await User.findOne({ $or: [{ uid: decoded.uid }, { _id: decoded.uid }] });
 if (!user) return res.status(401).json({ error: 'Пользователь не найден' });
 
 (req as any).user = user;
 next();
 } catch (err) {
 res.status(401).json({ error: 'Невалидный токен' });
 }
};

export const authorize = (...roles: string[]) => {
 return (req: Request, res: Response, next: NextFunction) => {
 const user = (req as any).user;
 if (!user) {
 return res.status(403).json({ error: 'Доступ запрещен' });
 }
 
 // Администратор имеет права врача
 const effectiveRoles = roles.includes('doctor') ? [...roles, 'admin'] : roles;
 
 if (!effectiveRoles.includes(user.role)) {
 return res.status(403).json({ error: 'Доступ запрещен' });
 }
 next();
 };
};

export const requireVerified = (req: Request, res: Response, next: NextFunction) => {
 const user = (req as any).user;
 if (!user.isEmailVerified) {
 return res.status(403).json({ error: 'Пожалуйста, подтвердите ваш email' });
 }
 next();
};
