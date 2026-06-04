// backend/bot/bot.ts
import { Telegraf, Markup, Context } from "telegraf";
import { User } from "../models/User";
import { Booking } from "../models/Booking";
import { Service } from "../models/Service";
import { Doctor } from "../models/Doctor";
import { Ticket } from "../models/Ticket";
import { openrouterService } from "../services/openrouterService";
import { chatMemory } from "../services/chatMemory";
import { ContextService } from "../services/contextService";
import { v4 as uuidv4 } from "uuid";

interface BotSession {
  isAuthorized: boolean;
  userId?: string;
  patientName?: string;
  bookingStep?: string;
  bookingData?: {
    serviceCategory?: string;
    serviceId?: string;
    serviceName?: string;
    doctorId?: string;
    date?: string;
    time?: string;
  };
}

interface MyContext extends Context {
  session: BotSession;
}

export class DentalBot {
  private bot: Telegraf<MyContext>;
  private sessions: Map<number, BotSession> = new Map();
  private categoryMap: string[] = [];
  private contextService: ContextService;
  private serviceMap: string[] = [];

  constructor() {
    if (!process.env.BOT_TOKEN) {
      throw new Error("BOT_TOKEN is not defined in environment variables");
    }
    this.bot = new Telegraf<MyContext>(process.env.BOT_TOKEN);
    this.setupMiddlewares();
    this.setupCommands();
    this.contextService = new ContextService();
    this.setupCallbacks();
    this.setupMessageHandler();
  }

  private setupMiddlewares() {
    this.bot.use(async (ctx, next) => {
      const userId = ctx.from.id;
      if (!this.sessions.has(userId)) {
        this.sessions.set(userId, {
          isAuthorized: false,
        });
      }
      ctx.session = this.sessions.get(userId)!;
      await next();
    });
  }

  private setupCommands() {
    this.bot.command("start", async (ctx) => {
      const session = ctx.session;

      if (!session.isAuthorized) {
        await ctx.reply(
          " *Добро пожаловать в стоматологическую клинику!*\n\n" +
            "Я виртуальный консультант. Чтобы продолжить, пожалуйста, отправьте номер телефона,\n" +
            "который вы указали при регистрации в клинике.\n\n" +
            "_Ваши данные защищены и используются только для идентификации._",
          {
            parse_mode: "Markdown",
            ...Markup.keyboard([
              [Markup.button.contactRequest(" Отправить номер телефона")],
            ]).resize(),
          },
        );
      } else {
        await this.showMainMenu(ctx);
      }
    });

    this.bot.command("help", async (ctx) => {
      await ctx.reply(
        " *Помощь*\n\n" +
          " *Доступные команды:*\n" +
          "/start - Главное меню\n" +
          "/services - Услуги и цены\n" +
          "/doctors - Наши врачи\n" +
          "/book - Записаться на прием\n" +
          "/mybookings - Мои записи\n" +
          "/cancel - Отменить запись\n" +
          "/help - Эта справка\n\n" +
          " *Или просто задайте вопрос в чате*",
        { parse_mode: "Markdown" },
      );
    });

    this.bot.command("services", async (ctx) => {
      const session = ctx.session;
      if (!session.isAuthorized) {
        await ctx.reply(" Пожалуйста, авторизуйтесь через /start");
        return;
      }
      await this.showServices(ctx);
    });

    this.bot.command("doctors", async (ctx) => {
      const session = ctx.session;
      if (!session.isAuthorized) {
        await ctx.reply(" Пожалуйста, авторизуйтесь через /start");
        return;
      }
      await this.showDoctors(ctx);
    });

    this.bot.command("book", async (ctx) => {
      const session = ctx.session;
      if (!session.isAuthorized) {
        await ctx.reply(" Пожалуйста, авторизуйтесь через /start");
        return;
      }
      await this.startBooking(ctx);
    });

    this.bot.command("mybookings", async (ctx) => {
      const session = ctx.session;
      if (!session.isAuthorized) {
        await ctx.reply(" Пожалуйста, авторизуйтесь через /start");
        return;
      }
      await this.showMyBookings(ctx);
    });

    this.bot.command("cancel", async (ctx) => {
      const session = ctx.session;
      if (!session.isAuthorized) {
        await ctx.reply(" Пожалуйста, авторизуйтесь через /start");
        return;
      }
      await this.showCancelOptions(ctx);
    });
    this.bot.command("clear", async (ctx) => {
      const userId = ctx.from.id.toString();
      chatMemory.clearHistory(userId);
      await ctx.reply(" *История диалога очищена!*", {
        parse_mode: "Markdown",
      });
    });
  }

  private setupCallbacks() {
    // Выбор категории
    this.bot.action(/cat_(\d+)/, async (ctx) => {
      const index = parseInt(ctx.match[1]);
      const category = this.categoryMap[index];
      if (!ctx.session.bookingData) {
        ctx.session.bookingData = {};
      }
      ctx.session.bookingData.serviceCategory = category;
      await this.showServicesInCategory(ctx, category);
      await ctx.answerCbQuery();
    });

    this.bot.action("cancel_menu", async (ctx) => {
      await this.showCancelOptions(ctx);
      await ctx.answerCbQuery();
    });

    this.bot.action("back_menu", async (ctx) => {
      ctx.session.bookingStep = undefined;
      ctx.session.bookingData = undefined;
      await this.showMainMenu(ctx);
      await ctx.answerCbQuery();
    });

    // Выбор услуги (только один обработчик!)
    this.bot.action(/serv_(\d+)/, async (ctx) => {
      const index = parseInt(ctx.match[1]);
      const serviceName = this.serviceMap[index];
      if (!ctx.session.bookingData) {
        ctx.session.bookingData = {};
      }
      ctx.session.bookingData.serviceName = serviceName;
      await this.showDoctorsForBooking(ctx);
      await ctx.answerCbQuery();
    });

    // Выбор врача
    this.bot.action(/doc_(.+)/, async (ctx) => {
      const doctorId = ctx.match[1];
      if (!ctx.session.bookingData) {
        ctx.session.bookingData = {};
      }
      ctx.session.bookingData.doctorId = doctorId;
      await this.askForDate(ctx);
      await ctx.answerCbQuery();
    });

    // Отмена записи
    this.bot.action(/cancel_(.+)/, async (ctx) => {
      const bookingId = ctx.match[1];
      await this.confirmCancelBooking(ctx, bookingId);
      await ctx.answerCbQuery();
    });

    this.bot.action(/confirm_(.+)/, async (ctx) => {
      const bookingId = ctx.match[1];
      await this.executeCancelBooking(ctx, bookingId);
      await ctx.answerCbQuery();
    });

    this.bot.action("back_menu", async (ctx) => {
      ctx.session.bookingStep = undefined;
      ctx.session.bookingData = undefined;
      await this.showMainMenu(ctx);
      await ctx.answerCbQuery();
    });

    this.bot.action("contact_op", async (ctx) => {
      await this.connectToOperator(ctx);
      await ctx.answerCbQuery();
    });
  }

  private setupMessageHandler() {
    this.bot.on("contact", async (ctx) => {
      const phoneNumber = ctx.message.contact.phone_number;
      const telegramId = ctx.from.id;

      const user = await User.findOne({
        phoneNumber: { $regex: phoneNumber.replace(/[^0-9]/g, "") + "$" },
      });

      if (user) {
        await User.updateOne(
          { _id: user._id },
          { $set: { telegramId: telegramId, lastLoginAt: new Date() } },
        );

        ctx.session.isAuthorized = true;
        ctx.session.userId = user._id;
        ctx.session.patientName = user.displayName || "Пациент";

        await ctx.reply(
          ` *Добро пожаловать, ${user.displayName || "пациент"}!*\n\n` +
            `Я виртуальный консультант стоматологии. Чем могу помочь?`,
          { parse_mode: "Markdown" },
        );

        await this.showMainMenu(ctx);
      } else {
        await ctx.reply(
          " *Номер не найден*\n\n" +
            "К сожалению, этот номер телефона не зарегистрирован в нашей базе.\n\n" +
            "Пожалуйста, свяжитесь с клиникой для регистрации:\n" +
            " +992 44 651 66 00",
          { parse_mode: "Markdown" },
        );
      }
    });

    this.bot.on("text", async (ctx) => {
      const text = ctx.message.text;
      const session = ctx.session;

      if (text.startsWith("/")) return;

      // 1. ПРОВЕРКА АКТИВНОГО ТИКЕТА
      if (session.isAuthorized && session.userId) {
        const activeTicket = await Ticket.findOne({
          patientId: session.userId,
          status: { $in: ["new", "open", "in_progress"] },
        });

        if (activeTicket) {
          await this.handlePatientMessage(ctx, text);
          return;
        }
      }

      // 2. ПРОВЕРКА ШАГОВ ЗАПИСИ
      if (session.bookingStep === "awaiting_date") {
        await this.processDate(ctx, text);
        return;
      }

      if (session.bookingStep === "awaiting_time") {
        await this.processTime(ctx, text);
        return;
      }

      // 3. КНОПКИ МЕНЮ
      if (text === " Услуги и цены") {
        await this.showServices(ctx);
        return;
      }
      if (text === " Наши врачи") {
        await this.showDoctors(ctx);
        return;
      }
      if (text === " Записаться") {
        await this.startBooking(ctx);
        return;
      }
      if (text === " Мои записи") {
        await this.showMyBookings(ctx);
        return;
      }
      if (text === " Задать вопрос") {
        await this.handleChatQuestion(ctx, text);
        return;
      }
      if (text === " Связаться с оператором") {
        await this.connectToOperator(ctx);
        return;
      }

      // 4. Ответ на вопрос пациента
      await this.handleChatQuestion(ctx, text);
    });
  }

  private async showMainMenu(ctx: MyContext) {
    await ctx.reply(` *Главное меню*\n\nВыберите действие:`, {
      parse_mode: "Markdown",
      ...Markup.keyboard([
        [" Услуги и цены", " Наши врачи"],
        [" Записаться", " Мои записи"],
        [" Задать вопрос", " Связаться с оператором"],
      ]).resize(),
    });
  }

  private async showServices(ctx: MyContext) {
    await ctx.replyWithChatAction("typing");

    try {
      const services = await Service.find();

      if (!services || services.length === 0) {
        await ctx.reply(" Список услуг временно недоступен.");
        return;
      }

      const categories = services
        .map((s: any) => s.category)
        .filter((c: string, i: number, arr: string[]) => arr.indexOf(c) === i);
      this.categoryMap = categories;

      const buttons = categories.map((category: string, index: number) => [
        Markup.button.callback(category.substring(0, 40), `cat_${index}`),
      ]);

      await ctx.reply(" *Выберите категорию услуг:*", {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard(buttons),
      });
    } catch (error) {
      console.error("Error showing services:", error);
      await ctx.reply(" Не удалось загрузить список услуг.");
    }
  }

  private async showServicesInCategory(ctx: MyContext, category: string) {
    try {
      const serviceDoc = await Service.findOne({ category });

      if (
        !serviceDoc ||
        !serviceDoc.services ||
        serviceDoc.services.length === 0
      ) {
        await ctx.reply("В этой категории пока нет услуг.");
        return;
      }

      let message = ` *${category}*\n\n`;
      serviceDoc.services.forEach((service: string, index: number) => {
        message += `${index + 1}. ${service}\n`;
      });
      message += "\n_Выберите услугу для записи:_";

      // Сохраняем список услуг в памяти
      this.serviceMap = serviceDoc.services;

      const buttons = serviceDoc.services.map(
        (service: string, index: number) => [
          Markup.button.callback(service.substring(0, 40), `serv_${index}`),
        ],
      );

      buttons.push([Markup.button.callback(" Назад", "back_menu")]);

      await ctx.editMessageText(message, {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard(buttons),
      });
    } catch (error) {
      console.error("Error showing services in category:", error);
      await ctx.reply(" Не удалось загрузить услуги.");
    }
  }

  private async showDoctors(ctx: MyContext) {
    await ctx.replyWithChatAction("typing");

    try {
      const doctors = await Doctor.find();

      if (!doctors || doctors.length === 0) {
        await ctx.reply(" Список врачей временно недоступен.");
        return;
      }

      let message = " *Наши специалисты*\n\n";

      doctors.forEach((doctor: any, index: number) => {
        message += `${index + 1}. *${doctor.name}*\n`;
        message += ` ${doctor.specialty}\n`;
        if (doctor.experience) {
          message += ` Стаж: ${doctor.experience}\n`;
        }
        message += `\n`;
      });

      const buttons = doctors.map((doctor: any) => [
        Markup.button.callback(
          `Записаться к ${doctor.name}`.substring(0, 60),
          `doc_${doctor._id}`,
        ),
      ]);

      await ctx.reply(message, {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard(buttons),
      });
    } catch (error) {
      console.error("Error showing doctors:", error);
      await ctx.reply(" Не удалось загрузить список врачей.");
    }
  }

  private async showDoctorsForBooking(ctx: MyContext) {
    try {
      const doctors = await Doctor.find();

      const buttons = doctors.map((doctor: any) => [
        Markup.button.callback(
          `${doctor.name} (${doctor.specialty})`.substring(0, 60),
          `doc_${doctor._id}`,
        ),
      ]);

      buttons.push([Markup.button.callback(" Назад", "back_menu")]);

      await ctx.editMessageText(
        " *Запись на прием*\n\nШаг 2: Выберите врача:",
        {
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard(buttons),
        },
      );
    } catch (error) {
      console.error("Error showing doctors for booking:", error);
      await ctx.reply(" Не удалось загрузить список врачей.");
    }
  }

  private async startBooking(ctx: MyContext) {
    ctx.session.bookingStep = undefined;
    ctx.session.bookingData = {};

    const services = await Service.find();

    const categories = services
      .map((s: any) => s.category)
      .filter((c: string, i: number, arr: string[]) => arr.indexOf(c) === i);
    this.categoryMap = categories;

    const buttons = categories.map((category: string, index: number) => [
      Markup.button.callback(category.substring(0, 40), `cat_${index}`),
    ]);

    buttons.push([Markup.button.callback(" Отмена", "back_menu")]);

    await ctx.reply(" *Запись на прием*\n\nШаг 1: Выберите категорию услуги:", {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard(buttons),
    });
  }

  private async askForDate(ctx: MyContext) {
    ctx.session.bookingStep = "awaiting_date";

    await ctx.reply(
      " *Запись на прием*\n\nШаг 3: Укажите дату\n\n" +
        "Пожалуйста, напишите желаемую дату в формате:\n" +
        "`25.12.2024`\n\n" +
        "_Доступные дни: Понедельник - Суббота_",
      { parse_mode: "Markdown" },
    );
  }

  private async processDate(ctx: MyContext, dateStr: string) {
    const dateRegex = /(\d{1,2})\.(\d{1,2})\.(\d{4})/;
    const match = dateStr.match(dateRegex);

    if (!match) {
      await ctx.reply(
        " *Неверный формат даты*\n\n" +
          "Используйте формат: ДД.ММ.ГГГГ\n" +
          "Например: 25.12.2024",
        { parse_mode: "Markdown" },
      );
      return;
    }

    const [_, day, month, year] = match;
    const selectedDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      await ctx.reply(" Нельзя записаться на прошедшую дату.");
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0) {
      await ctx.reply(
        " Клиника закрыта по воскресеньям. Выберите другой день (Пн-Сб).",
      );
      return;
    }

    ctx.session.bookingData!.date = `${day}.${month}.${year}`;
    ctx.session.bookingStep = "awaiting_time";

    await ctx.reply(
      " *Запись на прием*\n\nШаг 4: Укажите время\n\n" +
        "Напишите время в формате: `14:30`\n\n" +
        "_Доступное время: с 9:00 до 20:00_",
      { parse_mode: "Markdown" },
    );
  }

  private async processTime(ctx: MyContext, timeStr: string) {
    if (ctx.session.bookingStep !== "awaiting_time") {
      await ctx.reply(" Пожалуйста, сначала укажите дату.");
      return;
    }

    const timeRegex = /(\d{1,2}):(\d{2})/;
    const match = timeStr.match(timeRegex);

    if (!match) {
      await ctx.reply(
        " *Неверный формат времени*\n\n" +
          "Используйте формат: ЧЧ:ММ\n" +
          "Например: 14:30",
        { parse_mode: "Markdown" },
      );
      return;
    }

    const [_, hours, minutes] = match;
    const hour = parseInt(hours);

    if (hour < 9 || hour > 20) {
      await ctx.reply(" Прием ведется с 9:00 до 20:00.");
      return;
    }

    ctx.session.bookingData!.time = `${hours}:${minutes}`;
    await this.createBooking(ctx);
  }

  private async createBooking(ctx: MyContext) {
    const session = ctx.session;

    if (!session.userId) {
      await ctx.reply(" Ошибка: пользователь не авторизован");
      await this.showMainMenu(ctx);
      return;
    }

    if (!session.bookingData?.serviceName) {
      await ctx.reply(" Ошибка: услуга не выбрана");
      await this.startBooking(ctx);
      return;
    }

    if (!session.bookingData?.doctorId) {
      await ctx.reply(" Ошибка: врач не выбран");
      await this.startBooking(ctx);
      return;
    }

    if (!session.bookingData?.date) {
      await ctx.reply(" Ошибка: дата не указана");
      await this.askForDate(ctx);
      return;
    }

    if (!session.bookingData?.time) {
      await ctx.reply(" Ошибка: время не указано");
      await this.askForDate(ctx);
      return;
    }

    const { serviceName, doctorId, date, time } = session.bookingData;

    try {
      const bookingId = uuidv4();

      const booking = new Booking({
        _id: bookingId,
        patientId: session.userId,
        doctorId: doctorId,
        serviceId: serviceName,
        date: date,
        time: time,
        status: "pending",
        createdAt: new Date(),
      });

      await booking.save();

      const doctor = await Doctor.findById(doctorId);

      session.bookingStep = undefined;
      session.bookingData = undefined;

      await ctx.reply(
        " *Заявка на запись отправлена!*\n\n" +
          ` *Дата:* ${date}\n` +
          ` *Время:* ${time}\n` +
          ` *Услуга:* ${serviceName}\n` +
          ` *Врач:* ${doctor?.name || "Врач"}\n\n` +
          "_Администратор свяжется с вами для подтверждения._",
        { parse_mode: "Markdown" },
      );

      await this.showMainMenu(ctx);
    } catch (error) {
      console.error("Error creating booking:", error);
      await ctx.reply(
        " Не удалось создать запись. Пожалуйста, попробуйте позже.",
      );
    }
  }

  private async showMyBookings(ctx: MyContext) {
    await ctx.replyWithChatAction("typing");

    try {
      const session = ctx.session;
      // Ищем по patientId (строковый ID)
      const bookings = await Booking.find({ patientId: session.userId }).sort({
        createdAt: -1,
      });

      console.log("Найдено записей пользователя:", bookings.length);

      if (!bookings || bookings.length === 0) {
        await ctx.reply(
          " *У вас нет записей*\n\nИспользуйте /book для записи",
          { parse_mode: "Markdown" },
        );
        return;
      }

      let message = " *Ваши записи*\n\n";
      const now = new Date();
      const today = `${now.getDate().toString().padStart(2, "0")}.${(now.getMonth() + 1).toString().padStart(2, "0")}.${now.getFullYear()}`;

      const activeBookings = bookings.filter(
        (b: any) => b.date >= today && b.status !== "cancelled",
      );
      const pastBookings = bookings.filter(
        (b: any) => b.date < today || b.status === "cancelled",
      );

      if (activeBookings.length > 0) {
        message += "* Активные записи:*\n";
        activeBookings.forEach((booking: any, idx: number) => {
          const statusIcon =
            booking.status === "pending"
              ? "⏳"
              : booking.status === "confirmed"
                ? ""
                : "";
          message += `${idx + 1}. ${statusIcon} ${booking.date} ${booking.time} - ${booking.serviceId}\n`;
        });
        message += "\n";
      }

      if (pastBookings.length > 0) {
        message += "* История:*\n";
        pastBookings.slice(0, 5).forEach((booking: any, idx: number) => {
          const statusIcon = booking.status === "cancelled" ? "" : "";
          message += `${idx + 1}. ${statusIcon} ${booking.date} - ${booking.serviceId} (${booking.status === "cancelled" ? "Отменена" : "Завершена"})\n`;
        });
      }

      const buttons = [];
      if (activeBookings.length > 0) {
        buttons.push([
          Markup.button.callback(" Отменить запись", "cancel_menu"),
        ]);
      }
      buttons.push([Markup.button.callback(" Новая запись", "book_start")]);

      await ctx.reply(message, {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard(buttons),
      });
    } catch (error) {
      console.error("Error showing bookings:", error);
      await ctx.reply(" Не удалось загрузить записи.");
    }
  }

  private async showCancelOptions(ctx: MyContext) {
    const session = ctx.session;
    const now = new Date();
    const today = `${now.getDate().toString().padStart(2, "0")}.${(now.getMonth() + 1).toString().padStart(2, "0")}.${now.getFullYear()}`;

    // Ищем по patientId (строковый ID)
    const bookings = await Booking.find({
      patientId: session.userId, // userId из сессии - это строка _id из User
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: today },
    });

    console.log("Найдено записей для отмены:", bookings.length);

    if (bookings.length === 0) {
      await ctx.reply(" У вас нет активных записей для отмены.");
      return;
    }

    const buttons = bookings.map((booking: any) => [
      Markup.button.callback(
        `${booking.date} ${booking.time} - ${booking.serviceId}`.substring(
          0,
          60,
        ),
        `cancel_${booking._id}`, // Используем _id, а не bookingNumber
      ),
    ]);

    buttons.push([Markup.button.callback(" Назад", "back_menu")]);

    await ctx.reply(
      " *Выберите запись для отмены:*\n\n_Отмена возможна не позднее чем за 2 часа до приема_",
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard(buttons),
      },
    );
  }

  private async confirmCancelBooking(ctx: MyContext, bookingId: string) {
    // bookingId здесь - это _id из MongoDB
    await ctx.editMessageText(" *Вы уверены, что хотите отменить запись?*", {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(" Да", `confirm_${bookingId}`),
          Markup.button.callback(" Нет", "back_menu"),
        ],
      ]),
    });
  }

  private async executeCancelBooking(ctx: MyContext, bookingId: string) {
    try {
      // Ищем по _id (UUID строка)
      const booking = await Booking.findById(bookingId);

      console.log("Looking for booking with _id:", bookingId);
      console.log("Found booking:", booking);

      if (booking) {
        booking.status = "cancelled";
        await booking.save();
        await ctx.editMessageText(" *Запись успешно отменена!*", {
          parse_mode: "Markdown",
        });
      } else {
        await ctx.reply(
          " Запись не найдена. Пожалуйста, проверьте номер записи.",
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      await ctx.reply(" Не удалось отменить запись.");
    }
  }

  private async handleChatQuestion(ctx: MyContext, question: string) {
    await ctx.replyWithChatAction("typing");

    const userId = ctx.from.id.toString();
    const lowerQuestion = question.toLowerCase();

    // Быстрые ответы по правилам
    if (
      lowerQuestion.includes("привет") ||
      lowerQuestion.includes("здравствуй")
    ) {
      await ctx.reply(" Здравствуйте! Чем могу помочь?");
      return;
    }

    if (lowerQuestion.includes("спасиб")) {
      await ctx.reply("Всегда рад помочь! ");
      return;
    }

    if (
      lowerQuestion.includes("/clear") ||
      lowerQuestion === "очисти историю"
    ) {
      chatMemory.clearHistory(userId);
      await ctx.reply(" *История диалога очищена!*", {
        parse_mode: "Markdown",
      });
      return;
    }

    try {
      // Получаем контекст из БД
      const context = await this.contextService.getContextByQuestion(question);

      // Получаем историю диалога
      const history = chatMemory.getHistory(userId);

      // Отправляем запрос в сервис ответов
      const response = await openrouterService.getResponse(question, context);
      // Сохраняем в историю
      chatMemory.addMessage(userId, "user", question);
      chatMemory.addMessage(userId, "assistant", response);

      await ctx.reply(response, { parse_mode: "Markdown" });
    } catch (error) {
      console.error("Chat response error:", error);
      await ctx.reply(
        " *Не удалось получить ответ*\n\n" +
          'Пожалуйста, свяжитесь с оператором: нажмите " Связаться с оператором"',
        Markup.inlineKeyboard([
          [Markup.button.callback(" Связаться с оператором", "contact_op")],
        ]),
      );
    }
  }

  private async connectToOperator(ctx: MyContext) {
    const session = ctx.session;

    if (!session.isAuthorized || !session.userId) {
      await ctx.reply(" Пожалуйста, авторизуйтесь через /start");
      return;
    }

    const existingTicket = await Ticket.findOne({
      patientId: session.userId,
      status: { $in: ["new", "open", "in_progress"] },
    });

    if (existingTicket) {
      await ctx.reply(
        " *У вас уже есть активный диалог с оператором*\n\n" +
          `Номер обращения: #${existingTicket.ticketId}\n` +
          "Оператор ответит вам в ближайшее время.",
        { parse_mode: "Markdown" },
      );
      return;
    }

    const patient = await User.findById(session.userId);
    const ticketId = `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const ticket = new Ticket({
      ticketId: ticketId,
      patientId: session.userId,
      patientName: session.patientName || patient?.displayName || "Пациент",
      patientPhone: patient?.phoneNumber,
      chatId: ctx.chat.id,
      status: "new",
      priority: "normal",
      subject: "Обращение к оператору",
      messages: [
        {
          role: "patient",
          text: "Обращение к оператору",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    });

    await ticket.save();

    const io = require("../socket").getIO();
    if (io) {
      io.emit("new_ticket", {
        ticketId: ticket.ticketId,
        patientName: session.patientName,
        question: "Обращение к оператору",
      });
    }

    await ctx.reply(
      " *Соединение с оператором*\n\n" +
        ` Создано обращение #${ticketId}\n\n` +
        "Оператор скоро подключится. Ожидайте ответа в этом чате.\n\n" +
        "_Вы можете продолжать писать сообщения, оператор их увидит._",
      { parse_mode: "Markdown" },
    );
  }

  private async handlePatientMessage(ctx: MyContext, message: string) {
    const session = ctx.session;

    const ticket = await Ticket.findOne({
      patientId: session.userId,
      status: { $in: ["new", "open", "in_progress"] },
    });

    if (!ticket) {
      await this.handleChatQuestion(ctx, message);
      return;
    }

    ticket.messages.push({
      role: "patient",
      text: message,
      timestamp: new Date(),
    });
    ticket.lastActivity = new Date();
    await ticket.save();

    const io = require("../socket").getIO();
    if (io) {
      io.to(`ticket_${ticket.ticketId}`).emit("new_message", {
        role: "patient",
        text: message,
        timestamp: new Date(),
      });

      io.emit("patient_replied", {
        ticketId: ticket.ticketId,
        patientName: session.patientName,
      });
    }

    await ctx.reply(
      " *Сообщение отправлено оператору*\n\n" +
        "Оператор ответит вам в ближайшее время.",
      { parse_mode: "Markdown" },
    );
  }

  public launch() {
    this.bot.launch();
    console.log(" Telegram bot started");
  }

  public stop() {
    this.bot.stop();
  }
}
