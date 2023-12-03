const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const colors = require("colors");
const db = require("./configuration/config.js");
const router = require("./routers/route");
const { Server, Socket } = require("socket.io");
const namespace = require("./socket/nameSpace");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(
    cors({
        origin: "https://chathub-8hkp.onrender.com",
    })
);
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use(router);

const expressServer = app.listen(PORT, () => {
    console.log(`server listen on http://localhost:${PORT}`.bold.blue);
});

const io = new Server(expressServer, {
    pingTimeout: 60000,
    cors: {
        origin: "https://chathub-8hkp.onrender.com",
    },
});

namespace(io)
