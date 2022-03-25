const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const port = process.env.PORT || 3000;

const cors = require("cors");
app.use(cors());

app.use("/peerjs", peerServer);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:roomId", (req, res) => {
  res.render("room", { roomId: req.params.roomId });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    //socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.broadcast.emit('user-connected',userId);
  });
});

server.listen(port,err=>{
  err?console.log(err.message):console.log(`Listening on http//:localhost:3000`)
});

//1hr 39min


// npm i -g npm-check-updates
// ncu -u
// npm install