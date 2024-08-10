const http = require("http");
const socket = require("socket.io");
const express = require("express");
const path = require("path");

const app = express();

const PORT = 8080;

const server = http.createServer(app);
const io = socket(server);


io.on("connection", (socket)=>{
    console.log("==> ",socket.id);

    socket.on("send-location", (data)=>{
        console.log("==> ",socket.id, data);

        io.emit("recieve-location", {id: socket.id, ...data})
    })

    socket.on("disconnect",()=>{
        console.log("disconnect id: ",socket.id);
        io.emit("user-disconnect",socket.id)
    })
})

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
