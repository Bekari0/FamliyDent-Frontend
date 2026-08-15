import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config({ path: "../.env" });

class GroqService {
  private client: any;

  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not defined");
    }

    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
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
3. Если спрашивают о врачах - направляй к команде /doctors
4. Если спрашивают об услугах - направляй к команде /services
5. При вопросах о записи - предлагай команду /book
6. Если вопрос требует личного вмешательства - предложи связаться с оператором
7. НЕ СТАВЬ МЕДИЦИНСКИЕ ДИАГНОЗЫ
8. Будь дружелюбным и заботливым`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...(chatHistory || []),
        { role: "user", content: userMessage },
      ];

      // Пробуем разные бесплатные модели
      const completion = await this.client.chat.completions.create({
        messages: messages,
        model: "mixtral-8x7b-32768", // При необходимости модель можно заменить другой доступной.
        temperature: 0.7,
        max_tokens: 500,
      });

      console.log("Ответ консультанта получен");
      return (
        completion.choices[0]?.message?.content || "Не удалось получить ответ."
      );
    } catch (error: any) {
      console.error("Groq API Error:", error.message);
      console.error("Full error:", error);

      // Если сервис недоступен, используем резервный ответ
      return "Извините, онлайн-консультант временно недоступен. Пожалуйста, свяжитесь с оператором.";
    }
  }
}

export const groqService = new GroqService();
