import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
// * server using ws
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
// * express for http request
app.get("*", (_, res) => res.redirect("/"));
// * create server for http request
// * now we have access to server object and we can create web socket
// * now wss and http running on same server
// * but i dont need to create http server for wss
const server = http.createServer(app);
const sockets = [];
const wss = new WebSocketServer({ server });
// const wss = new WebSocket.Server({ server });
// const wss = new WebSocketServer({ port: 8080 });
// * web socket for the front end https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
// * in wss we have a event called connection which will be called when a new connection is made
// * wss.on("connection", (ws) => {})
wss.on("connection", (socket) => {
  // * FIXME
  // * NOTE
  // * socket is the connection object is just like e in event listener
  //   * now in the front end we have to connect to the server and send the message
  socket.send("hello from the server");
  // * now we need to listen to the message from the front end
  // * on user close the connection we need to close the connection
  socket.on("close", () => console.log("disconnected from the clint"));
  // * on user close the connection
  //   socket.on("message", (message) => {
  //     console.log(message.toString());
  //     socket.send(message.toString());
  //   });
  // * now if i connected from chrome than connected from firefox ever one of them will be independent
  //   so what is create fake database
  const SOCKET_ID = Math.random() * 1000000;
  socket["id"] = SOCKET_ID;
  sockets.push(socket);
  socket.nickname = "Anonymous";
  socket.on("message", (message) => {
    const myPartedMessage = JSON.parse(message.toString());
    console.log(socket.nickname);
    switch (myPartedMessage.type) {
      case "NEW_MESSAGE":
        sockets.forEach((aSocket) => {
          if (socket["id"] !== aSocket["id"])
            aSocket.send(`${socket.nickname}: ${myPartedMessage.payload}`);
        });
        break;
      case "NICKNAME":
        socket.nickname = myPartedMessage.payload;
        break;
    }
  });
  //   so if i resive message i will send it to all other clients
});
server.listen(3000, () => console.log("Server started on port 3000"));
/**@summary
 * recap of the server
 * make the wss and server running on same server and same port or any thing
 * listen to the connection event wws.on("connection", (ws) => {})
 * send the message to the front end socket.send("hello from the server")
 * listen to the message event socket.on("message", (message) => {})
 * listen to the close event socket.on("close", () => {})
 */
