const express = require("express");
const cors = require("cors");
const http = require("http");
// const shortid = require("shortid");
const bodyParser = require("body-parser");

const app = express();

const httpServer = http.Server(app);
const io = require("socket.io")(httpServer);

app.use(cors({
  origin: "http://localhost:8080",
}));
app.use(express.static("dist"));
app.use(bodyParser.json());

const namespaces = {};
const messageMap = {};
const namespaceRegex = /^[A-z]+$/;

function appendMessage(namespace, message) {
  if (!Array.isArray(messageMap[namespace])) {
    messageMap[namespace] = [];
  }

  const list = messageMap[namespace];

  if (list.length === 10) {
    list.shift();
  }
  list.push(message);
}

function createNameSpace(namespace, cb) {
  if (namespaces[namespace]) {
    const err = new Error(`Namespace '${namespace}' already exists.`);
    if (typeof cb !== "function") {
      throw err;
    }
    cb(err);
    return;
  }

  if (!namespaceRegex.test(namespace)) {
    const err = new Error(`Invalid namespace '${namespace}'`);
    if (typeof cb !== "function") {
      throw err;
    }
    cb(err);
    return;
  }

  namespaces[namespace] = true;

  const nsp = io.of("/" + namespace);
  console.log(`Namespace '${namespace}' created.`);
  if (typeof cb === "function") {
    cb(null);
  }

  nsp.on("connection", (socket) => {
    socket.on("login", ({ username }) => {
      console.log(`${username} joined ${namespace}`);

      socket.emit("login", username);
      socket.on("msg", (text) => {
        console.log(namespace, `${username}: ${text}`);
        appendMessage(namespace, { username, text });
        nsp.emit("msg", {
          username,
          text,
        });
      });

      socket.on("disconnect", () => {
        console.log(`${username} has left ${namespace}`);
      });
    });
  });
}

const defaultNamespaces = ["general", "random"];

for (let i = 0; i < defaultNamespaces.length; i += 1) {
  createNameSpace(defaultNamespaces[i]);
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.statusMessage = "Username and password are required.";
    res.sendStatus(400);
  }
});

app.post("/createRoom", (req, res) => {
  const namespace = req.body.room;

  if (!namespace || typeof namespace !== "string") {
    res.statusMessage = "Expected room to be a string.";
    res.sendStatus(400);
    return;
  }

  if (namespaces[namespace]) {
    res.statusMessage = "ROOM_EXISTS";
    res.sendStatus(409);
    return;
  }

  if (!namespaceRegex.test(namespace)) {
    res.statusMessage = "INVALID_NAME";
    res.sendStatus(400);
    return;
  }

  createNameSpace(namespace, (err) => {
    if (err) { throw err; }
    res.sendStatus(201);
  });
});

app.post("/checkRoomExists", (req, res) => {
  const namespace = req.body.room;

  if (!namespace || typeof namespace !== "string") {
    res.statusMessage = "Expected room to be a string.";
    res.sendStatus(400);
    return;
  }

  if (!namespaceRegex.test(namespace)) {
    res.statusMessage = "INVALID_NAME";
    res.sendStatus(400);
    return;
  }

  if (namespaces[namespace]) {
    res.sendStatus(200);
    return;
  }

  res.statusMessage = "ROOM_NO_EXIST";
  res.sendStatus(404);
});

app.get("/recentMessages/:namespace", (req, res) => {
  const { namespace } = req.params;

  if (!namespaces[namespace]) {
    res.statusMessage = "ROOM_NO_EXIST";
    res.sendStatus(404);
    return;
  }

  console.log(namespace, messageMap[namespace]);
  if (messageMap[namespace]) {
    res.json(messageMap[namespace]);
    return;
  }
  res.json([]);
});

const port = 3000;

app.listen(3333, () => {
  console.log(`Listening on http://localhost:${port}`);
});

httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
