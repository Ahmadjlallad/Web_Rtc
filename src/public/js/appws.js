const ulMessage = document.querySelector("ul");
const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener("open", () => console.log("connected to server"));
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.textContent = message.data;
  ulMessage.appendChild(li);
});
socket.addEventListener("close", () => console.log("disconnected from server"));
// setTimeout(() => socket.send("hello form the browser"), 1000);
/**
 * in the frontend, we can use the socket to send messages to the server
 * new WebSocket(`ws://${window.location.host}`);
 * addEventListener("open", () => console.log("connected to server"));
 * for the event listener, we can use the socket to listen to the server
 * addEventListener("message", (e) => console.log(e.data));
 * addEventListener("close", () => console.log("disconnected from server"));
 * socket.send("hello form the browser");
 */
const messageForm = document.querySelector("#messageForm");
const nicknameForm = document.querySelector("#nicknameForm");
const makeMessage = (message) => {
  return JSON.stringify(message);
};
const handleSubmit = (e) => {
  e.preventDefault();
  const input = e.target.message.value;
  socket.send(makeMessage({ payload: input, type: "NEW_MESSAGE" }));
  const li = document.createElement("li");
  li.textContent = `You: ${input}`;
  ulMessage.appendChild(li);
  e.target.message.value = "";
};
nicknameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.nickname.value;
  socket.send(makeMessage({ payload: input, type: "NICKNAME" }));
});
messageForm.addEventListener("submit", handleSubmit);
