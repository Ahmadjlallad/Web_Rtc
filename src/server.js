import express from "express";
import http from "http";
import SocketIO from "socket.io";
// * server using socket.io
const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
/**
 * if user did go to route /public then it will return the file
 */
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => {
  res.render("home");
});

app.get("*", (_, res) => res.redirect("/"));

// * same as before but with socket.io
const server = http.createServer(app);
const io = SocketIO(server);
const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  return [...rooms.keys()].filter((room) => !sids.get(room));
};
const countRoom = (room) => {
  return io.sockets.adapter.rooms.get(room)?.size;
};
io.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  socket.onAny((e) => {});
  socket.on("enter_room", (roomName, next) => {
    socket.join(roomName);
    socket
      .to(roomName)
      .emit("welcome", `${socket.nickname} has joined`, countRoom(roomName));
    next(roomName);
    io.sockets.emit("room_change", publicRooms());
    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) => {
        socket
          .to(room)
          .emit("bye", `${socket.nickname} has left`, countRoom(roomName) - 1);
        io.sockets.emit("room_change", publicRooms());
      });
    });
  });
  socket.on("new_message", (message, roomName, done) => {
    socket.to(roomName).emit("new_message", `${socket.nickname}: ${message}`);
    done();
  });
  socket.on("new_user", (username) => {
    socket["nickname"] = username;
  });
});
server.listen(3000, () => console.log("Server started on port 3000"));
