const mongoose = require("mongoose");
require("dotenv").config();
const colors = require("colors");
const MONGO_UESR = process.env.MONGO_UESR;
const MONGO_PASS = process.env.MONGO_PASS;

const URI = `mongodb+srv://${MONGO_UESR}:${MONGO_PASS}@cluster0.dxkr6fl.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(URI)
    .then(() => {
        console.log("connection done".bold.yellow);
    })
    .catch((error) => {
        console.log(error);
        console.log("error in connecting atlas".bold.red);
    });
