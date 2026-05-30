// backend/socket.ts
import { Server as SocketServer } from "socket.io";
import { Ticket } from "./models/Ticket";

let io: SocketServer;
let bot: any;

export function initSocket(server: any, telegramBot: any) {
  bot = telegramBot;
  io = new SocketServer(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const onlineOperators = new Map();

  io.on("connection", (socket) => {
    console.log(" Operator connected:", socket.id);

    socket.on("operator_auth", async (data) => {
      const { token, name } = data;

      if (token === process.env.OPERATOR_SECRET_KEY) {
        onlineOperators.set(socket.id, {
          id: socket.id,
          name,
          currentTicket: null,
        });
        socket.emit("auth_success", { message: "Authenticated!" });

        const activeTickets = await Ticket.find({
          status: { $in: ["new", "open", "in_progress"] },
        }).sort({ createdAt: -1 });
        socket.emit("tickets_list", activeTickets);
        io.emit("operators_count", onlineOperators.size);
      } else {
        socket.emit("auth_error", { message: "Invalid token" });
      }
    });

    socket.on("refresh_tickets", async () => {
      const activeTickets = await Ticket.find({
        status: { $in: ["new", "open", "in_progress"] },
      }).sort({ createdAt: -1 });
      socket.emit("tickets_list", activeTickets);
    });

    socket.on("take_ticket", async (data) => {
      const { ticketId } = data;
      const operator = onlineOperators.get(socket.id);
      if (!operator) return;

      const ticket = await Ticket.findOne({ ticketId });
      if (ticket && (ticket.status === "new" || ticket.status === "open")) {
        ticket.status = "in_progress";
        ticket.operatorId = socket.id;
        ticket.operatorName = operator.name;
        ticket.operatorJoinedAt = new Date();
        await ticket.save();

        operator.currentTicket = ticketId;
        onlineOperators.set(socket.id, operator);
        socket.join(`ticket_${ticketId}`);
        socket.emit("ticket_history", ticket.messages);

        // Исправлено: bot.bot.telegram.sendMessage
        if (bot && bot.bot && ticket.chatId) {
          try {
            await bot.bot.telegram.sendMessage(
              ticket.chatId,
              ` *Оператор ${operator.name} подключился к чату*\n\nВаш вопрос принят в работу.`,
              { parse_mode: "Markdown" },
            );
          } catch (error) {
            console.error("Error sending message:", error);
          }
        }
        io.emit("ticket_updated", {
          ticketId,
          status: "in_progress",
          operator: operator.name,
        });
      }
    });

    socket.on("send_message", async (data) => {
      const { ticketId, message } = data;
      const operator = onlineOperators.get(socket.id);
      if (!operator) return;

      const ticket = await Ticket.findOne({ ticketId });
      if (ticket) {
        ticket.messages.push({
          role: "operator",
          text: message,
          operatorName: operator.name,
          timestamp: new Date(),
        });
        ticket.lastActivity = new Date();
        await ticket.save();

        // Исправлено: bot.bot.telegram.sendMessage
        if (bot && bot.bot && ticket.chatId) {
          try {
            await bot.bot.telegram.sendMessage(
              ticket.chatId,
              ` *Оператор ${operator.name}:*\n\n${message}`,
              { parse_mode: "Markdown" },
            );
          } catch (error) {
            console.error("Error sending message:", error);
          }
        }

        socket.emit("message_sent", { message, timestamp: new Date() });
        io.to(`ticket_${ticketId}`).emit("new_message", {
          role: "operator",
          text: message,
          operatorName: operator.name,
          timestamp: new Date(),
        });
      }
    });

    socket.on("close_ticket", async (data) => {
      const { ticketId, resolution } = data;
      const operator = onlineOperators.get(socket.id);
      const ticket = await Ticket.findOne({ ticketId });

      if (ticket) {
        ticket.status = "closed";
        ticket.closedAt = new Date();
        ticket.closedBy = operator?.name || "System";
        ticket.resolution = resolution;
        await ticket.save();

        if (bot && bot.bot && ticket.chatId) {
          try {
            await bot.bot.telegram.sendMessage(
              ticket.chatId,
              ` *Вопрос решен!*\n\n${resolution ? `Решение: ${resolution}\n\n` : ""}Чат закрыт.`,
              { parse_mode: "Markdown" },
            );
          } catch (error) {
            console.error("Error sending message:", error);
          }
        }

        io.emit("ticket_closed", { ticketId, closedBy: operator?.name });
        socket.leave(`ticket_${ticketId}`);
        if (operator) operator.currentTicket = null;
        onlineOperators.set(socket.id, operator);
      }
    });

    socket.on("disconnect", () => {
      console.log(" Operator disconnected:", socket.id);
      onlineOperators.delete(socket.id);
      io.emit("operators_count", onlineOperators.size);
    });
  });

  return io;
}

export function getIO() {
  return io;
}
