// backend/server.ts
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import app from "./app.ts";
import { connectDB } from "./config/db";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import authRoutes from "./routes/auth";
import doctorRoutes from "./routes/doctors";
import serviceRoutes from "./routes/services";
import bookingRoutes from "./routes/bookings";
import articleRoutes from "./routes/articles";
import reviewRoutes from "./routes/reviews";
import medicalRecordRoutes from "./routes/medicalRecords";
import medicalRoutes from "./routes/medical";
import adminRoutes from "./routes/admin";
import doctorDashboardRoutes from "./routes/doctorDashboard";
import urgentRequestRoutes from "./routes/urgentRequests";
import userRoutes from "./routes/users";
import { initSocket } from "./socket";
import { DentalBot } from "./bot/bot";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("Starting integrated server...");
  console.log("Current working directory:", process.cwd());
  console.log("__dirname:", __dirname);

  // Connect to DB
  try {
    await connectDB();
    console.log("Database connection process completed");
  } catch (err) {
    console.error("Database connection failed:", err);
  }

  // API Routes
  console.log("Configuring API routes...");
  app.use("/api/auth", authRoutes);
  app.use("/api/doctors", doctorRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/articles", articleRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/medical-records", medicalRecordRoutes);
  app.use("/api/medical", medicalRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/doctor", doctorDashboardRoutes);
  app.use("/api/urgent-requests", urgentRequestRoutes);
  app.use("/api/users", userRoutes);

  // Catch-all API 404s
  app.use("/api/*", (req, res) => {
    console.warn(`API 404: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  // Serve static files from public folder
  const publicPath = path.join(__dirname, "public");
  console.log("Serving public from:", publicPath);
  app.use(express.static(publicPath));

  // Явный маршрут для панели оператора
  app.get("/operator-panel.html", (req, res) => {
    const panelPath = path.join(__dirname, "public", "operator-panel.html");
    console.log("Serving operator panel from:", panelPath);
    res.sendFile(panelPath);
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Detected development mode. Starting Vite middleware...");
    try {
      const rootPath = path.join(__dirname, ".."); // Поднимаемся на уровень выше (в familydent)
      console.log("Vite root path:", rootPath);
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
        root: rootPath,
      });
      app.use(vite.middlewares);

      app.use("*", (req, res) => {
        const indexPath = path.join(__dirname, "..", "index.html");
        console.log("Serving index.html from:", indexPath);
        res.sendFile(indexPath);
      });

      console.log("Vite middleware started successfully");
    } catch (err) {
      console.error("Failed to start Vite middleware:", err);
    }
  } else {
    console.log("Detected production mode. Serving static files...");
    const distPath = path.join(__dirname, "..", "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;

  // СОЗДАЕМ СЕРВЕР
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> Server running on http://localhost:${PORT}`);
  });

  // ЗАПУСК ТЕЛЕГРАМ БОТА
  let dentalBot: DentalBot | null = null;
  try {
    dentalBot = new DentalBot();
    dentalBot.launch();
    console.log(" Telegram bot launched successfully");
  } catch (error) {
    console.error(" Failed to launch Telegram bot:", error);
  }

  // ИНИЦИАЛИЗАЦИЯ WEBSOCKET (передаем бота)
  const io = initSocket(server, dentalBot);

  // КОРРЕКТНОЕ ЗАВЕРШЕНИЕ
  process.once("SIGINT", () => {
    if (dentalBot) dentalBot.stop();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  process.once("SIGTERM", () => {
    if (dentalBot) dentalBot.stop();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
}

startServer().catch(console.error);

export { startServer };
