const express = require("express");
const http = require("http");
const shortid = require("shortid");

const app = express();

const httpServer = http.Server(app);
const io = require("socket.io")(httpServer);

app.use(express.static("dist"));

io.on("connection", (socket) => {
  const userId = shortid();

  socket.on("msg", ({ room, text }) => {
    console.log(`${userId}: ${text}`);
    io.emit(`${room}:msg`, {
      userId,
      text,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = 3000;

httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
