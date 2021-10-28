// * connection to websocket server using socket.io client
const socket = io();
// * socket.emit just emits a event to the server and send the data to the server
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.room.value;
  socket.emit("enter_room", { payload: name }, () => {
    console.log("next");
  });
  welcome.classList.add("hidden");
});
