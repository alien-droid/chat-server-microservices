import { Server } from "http";
import app from "./app";
import config from "./config/config";
import { connectDB, Message } from "./database";
import { Socket, Server as SocketIOServer } from "socket.io";

let server: Server;
connectDB();

server = app.listen(config.PORT || 3000, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

const io = new SocketIOServer(server);

io.on("connection", (socket: Socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log(`A user disconnected, ${socket.id}`);
    socket.disconnect(true);
  });

  socket.on("sendMessage", (message: string) => {
    console.log(`Message received from ${socket.id}: ${message}`);
    io.emit("receiveMessage", message);
  });

  socket.on("sendMessage", async (data: any) => {
    const { receiverId, message, senderId } = data;
    const msg = new Message({ senderId, receiverId, message });
    await msg.save();

    console.log(`Message received from ${socket.id}: ${message}`);
    io.to(receiverId).emit("receiveMessage", message);
  });
});
// for closing the server gracefully
const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// for handling unexpected errors
const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
