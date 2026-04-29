import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = `
Вы — AI-ассистент стоматологической клиники FamilyDent в Душанбе, Таджикистан.
Ваша цель — помогать пациентам, отвечать на вопросы об услугах, ценах и записывать на прием.
Будьте вежливы, профессиональны и заботливы.

Информация о клинике:
- Название: FamilyDent
- Адрес: г. Душанбе (уточните у администратора)
- Услуги: терапия, хирургия, ортодонтия, гигиена, имплантация.
- Врачи: Саид Ахмедов (хирург), Мадина Каримова (ортодонт), Рустам Назаров (терапевт).

Если пользователь хочет записаться, попросите его оставить имя и номер телефона, и скажите, что администратор свяжется с ним в ближайшее время.
Отвечайте на русском языке.
`;

export async function getChatResponse(messages: Message[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Извините, произошла ошибка. Попробуйте позже.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Извините, я сейчас не могу ответить. Пожалуйста, позвоните нам напрямую.";
  }
}
