import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Загружаем переменные окружения.
dotenv.config({ path: "../.env" });

class GeminiService {
  private generationClient: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    this.generationClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.generationClient.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  }

  async getResponse(
    userMessage: string,
    context?: string,
    chatHistory?: Array<{ role: string; content: string }>,
  ): Promise<string> {
    try {
      const systemPrompt = `Ты - онлайн-консультант стоматологической клиники. 

Правила:
1. Отвечай вежливо и профессионально на РУССКОМ языке
2. Используй информацию из контекста: ${context || "Информация о клинике временно недоступна."}
3. Если спрашивают о врачах, услугах или ценах - направляй к командам /doctors, /services
4. При вопросах о записи - предлагай команду /book
5. Если вопрос требует личного вмешательства - предложи связаться с оператором
6. НЕ СТАВЬ МЕДИЦИНСКИЕ ДИАГНОЗЫ. Всегда говори "Для точной диагностики необходимо обратиться к врачу"
7. Будь дружелюбным и заботливым`;

      let prompt = systemPrompt + "\n\n";

      if (chatHistory && chatHistory.length > 0) {
        prompt += "История диалога:\n";
        for (const msg of chatHistory.slice(-6)) {
          prompt += `${msg.role === "user" ? "Пациент" : "Ассистент"}: ${msg.content}\n`;
        }
        prompt += "\n";
      }

      prompt += `Пациент: ${userMessage}\nАссистент:`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return response || "Извините, не удалось сформировать ответ.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Извините, произошла ошибка. Пожалуйста, попробуйте позже.";
    }
  }
}

export const geminiService = new GeminiService();
