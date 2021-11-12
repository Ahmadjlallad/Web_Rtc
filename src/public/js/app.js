// * connection to websocket server using socket.io client
const socket = io();
const addMessage = (mes) => {
  const [, ul] = document.querySelectorAll("ul");
  const li = document.createElement("li");
  li.textContent = mes;
  ul.appendChild(li);
};
let roomName;
// * socket.emit just emits a event to the server and send the data to the server
const welcome = document.getElementById("welcome");
const [nicknameForm, roomForm, messageFrom] = document.querySelectorAll("form");
const room = document.getElementById("room");
const h3 = document.querySelector("h3");
room.hidden = true;
const showRoom = (roomName) => {
  welcome.hidden = true;
  room.hidden = false;
  h3.textContent = `Room ${roomName}`;
};
roomForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.room.value;
  roomName = name;
  socket.emit("enter_room", name, showRoom);
});

messageFrom.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.message.value;
  socket.emit("new_message", msg, roomName, () => addMessage(`you: ${msg}`));
});

socket.on("new_message", addMessage);
nicknameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.nickname.value;
  socket.emit("new_user", name);
});

socket.on("welcome", (mes, countRoom) => {
  addMessage(mes);
  h3.textContent = h3.textContent + ` (${countRoom})`;
});
socket.on("bye", (mes, countRoom) => {
  addMessage(mes);
  h3.textContent = h3.textContent + ` (${countRoom})`;
});
socket.on("room_change", (rooms) => {
  console.log(rooms);
  const [ul] = document.querySelectorAll("ul");
  if (rooms.length === 0) {
    ul.innerHTML = "";
    return;
  }
  ul.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.textContent = `Room Name: ${room}`;
    ul.appendChild(li);
  });
});
