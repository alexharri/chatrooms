const express = require("express");
const http = require("http");
const shortid = require("shortid");
const bodyParser = require("body-parser");

const app = express();

const httpServer = http.Server(app);
const io = require("socket.io")(httpServer);

app.use(express.static("dist"));
app.use(bodyParser.json());

function createNameSpace(namespace) {
  const nsp = io.of(namespace);

  nsp.on("connection", (socket) => {
    socket.on("login", ({ username, password }) => {
      console.log({ username, password });

      socket.emit("login", username);
      socket.on("msg", (text) => {
        console.log(namespace, `${username}: ${text}`);
        nsp.emit("msg", {
          username,
          text,
        });
      });
    });
  });
}

const defNsp = ["/general", "/random"];

for (let i = 0; i < defNsp.length; i += 1) {
  createNameSpace(defNsp[i]);
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.statusMessage = "Username and password are required.";
    res.sendStatus(400);
  }
});

const port = 3000;

httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
