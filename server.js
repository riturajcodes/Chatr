const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(require("cors")());

app.get("/", (req, res) => {
  let countFileText = fs.readFileSync("count.txt", "utf-8");
  let newCount = parseInt(countFileText) + 1;
  let newCountText = newCount.toString();
  fs.writeFileSync("./count.txt", newCountText);
  res.render("index");
});
app.get("/start", (req, res) => {
  res.render("start");
});
app.get("/room", (req, res) => {
  res.redirect(`/room/${uuidv4()}`);
});
app.get("/dev/usercount", (req, res) => {
  let countFileText2 = fs.readFileSync("count.txt", "utf-8");
  res.send(countFileText2);
});
app.get("/room/:roomId", (req, res) => {
  res.render("chat", { roomId: `/room/${req.params.roomId}` });
});

// socket io code
io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", "user");
    socket.to(roomId).emit("user-connected-msg");
    socket.on("chat message", (msg) => {
      socket.to(roomId).emit("chat message", msg);
    });
  });
});
// socket io code

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
