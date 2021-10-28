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

io.on("connection", (socket) => {
  socket.on("enter_room", (msg, next) => {
    console.log(msg);
    setTimeout(() => {
      next();
    }, 10000);
  });
});

server.listen(3000, () => console.log("Server started on port 3000"));
