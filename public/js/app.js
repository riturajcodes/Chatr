var socket = io("/");
// socket io code
let messages = document.getElementById("messageContainer");
let form = document.getElementById("form");
let input = document.getElementById("input");
let sound = document.getElementById("sound");
let username = prompt("Enter your name to join", "guest");
console.log(ROOM_ID);

socket.emit("join-room", ROOM_ID);

socket.on("user-connected", (userId) => {
  console.log("new " + userId);
});
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value, username);
    input.value = "";
  }
});
socket.on("chat message", function (msg) {
  var item = document.createElement("div");
  item.textContent = msg;
  item.classList.add("left");
  item.classList.add("message");
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
socket.on("user-connected-msg", () => {
  console.log("user joined");
  var item = document.createElement("div");
  item.innerText = `A new user just showed up in this chat`;
  item.classList.add("left");
  item.classList.add("message");
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// socket io code
let sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", () => {
  if (input.value != "") {
    var item = document.createElement("div");
    item.innerText = input.value;
    item.classList.add("right");
    item.classList.add("message");
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    sound.play();
  }
});
