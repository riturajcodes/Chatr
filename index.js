const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/room", (req, res) => {
  res.render("chat");
});
// socket io code

io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    socket.broadcast.emit("user-connected", userId);
    socket.on("chat message", (msg) => {
      socket.broadcast.emit("chat message", msg);
    });
    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", userId);
    });
  });
});
// socket io code

server.listen(port, () => {
  console.log(`app started on http://127.0.0.1:${port}`);
});
