interface Message {
 role: 'user' | 'assistant';
 content: string;
 timestamp: Date;
}

class ChatMemory {
 private sessions: Map<string, Message[]> = new Map();
 private maxMessages = 20;

 getHistory(userId: string): Message[] {
 return this.sessions.get(userId) || [];
 }

 addMessage(userId: string, role: 'user' | 'assistant', content: string) {
 const history = this.sessions.get(userId) || [];
 history.push({ role, content, timestamp: new Date() });
 
 // Ограничиваем размер истории
 if (history.length > this.maxMessages) {
 history.shift();
 }
 
 this.sessions.set(userId, history);
 }

 clearHistory(userId: string) {
 this.sessions.delete(userId);
 }
}

export const chatMemory = new ChatMemory();
