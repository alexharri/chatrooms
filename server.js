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

function createNameSpace(namespace, cb) {
  if (namespaces[namespace]) {
    const err = new Error(`Namespace '${namespace}' already exists.`);
    if (typeof cb === "function") {
      cb(err);
    } else {
      throw err;
    }
  }

  /*
  if (namespaceRegexTest) {
    throw new Error("Handle this case.");
  }
  */

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
  console.log("Hello");
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

  createNameSpace(namespace, (err) => {
    if (err) { throw err; }
    res.sendStatus(201);
  });
});

const port = 3000;

app.listen(3333, () => {
  console.log(`Listening on http://localhost:${port}`);
});

httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
