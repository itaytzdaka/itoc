//if development, load .env file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//npm i  express
const express = require("express");
const server = express();

//for support json in body
server.use(express.json());

//npm i cors
const cors = require("cors");
server.use(cors({
    origin: "http://localhost:3001",
    credentials: true //for alow passing cookies from client to server
}));

//use cookie in request
const cookieParser = require("cookie-parser");
server.use(cookieParser());

//use a controller
const authController=require("./controllers/auth-controller");
const requestsController=require("./controllers/requests-controller");
server.use("/api/auth", authController); //add router to server
server.use("/api/requests", requestsController); //add router to server

const path = require("path");

//serve static files for client, like images.
server.use(express.static(path.join(__dirname, "./_front-end")));

//any other route serve index.html, for example : \login
server.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./_front-end/index.html"));
});

//define the port
const port = process.env.PORT || 3000;
server.listen(port, () => console.log("Listening on port "+ port));
