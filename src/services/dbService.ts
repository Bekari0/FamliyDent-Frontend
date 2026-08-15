import axios from 'axios';

const API_URL = '/api';

// Создаём клиент Axios с адресом относительно текущего домена.
const api = axios.create({
 baseURL: API_URL
});

export enum OperationType {
 CREATE = 'create',
 UPDATE = 'update',
 DELETE = 'delete',
 LIST = 'list',
 GET = 'get',
 WRITE = 'write',
}

export class DbService {
 static async getAll<T>(path: string): Promise<T[]> {
 try {
 console.log(`[DbService] Fetching from: ${API_URL}/${path}`);
 const response = await api.get(`/${path}`);
 return Array.isArray(response.data) ? response.data : [];
 } catch (error) {
 if (axios.isAxiosError(error)) {
 console.error(`[DbService] Axios error fetching ${path}:`, error.message, error.code);
 } else {
 console.error(`[DbService] Error fetching ${path}:`, error);
 }
 return [];
 }
 }

 static async getById<T>(path: string, id: string): Promise<T | null> {
 try {
 const response = await api.get(`/${path}/${id}`);
 return response.data;
 } catch (error) {
 console.error(`Error fetching ${path}/${id}:`, error);
 return null;
 }
 }

 static async create<T>(path: string, data: any): Promise<any> {
 try {
 const response = await api.post(`/${path}`, data);
 return response.data;
 } catch (error) {
 console.error(`Error creating in ${path}:`, error);
 throw error;
 }
 }

 static async update(path: string, id: string, data: any): Promise<void> {
 try {
 await api.put(`/${path}/${id}`, data);
 } catch (error) {
 console.error(`Error updating ${path}/${id}:`, error);
 }
 }

 static async delete(path: string, id: string): Promise<void> {
 try {
 await api.delete(`/${path}/${id}`);
 } catch (error) {
 console.error(`Error deleting ${path}/${id}:`, error);
 }
 }

 // Специализированные запросы
 static async getBookingsForUser(userId: string) {
 try {
 const response = await api.get(`/bookings?patientId=${userId}`);
 return Array.isArray(response.data) ? response.data : [];
 } catch (error) {
 console.error('Error fetching user bookings:', error);
 return [];
 }
 }

 // Обновление данных через периодический опрос
 static subscribeToCollection<T>(path: string, callback: (data: T[]) => void) {
 this.getAll<T>(path).then(callback);
 const interval = setInterval(() => {
 this.getAll<T>(path).then(callback);
 }, 5000);
 return () => clearInterval(interval);
 }
}
