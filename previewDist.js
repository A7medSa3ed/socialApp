// this is file used to run dist folder to show it's output

const express = require("express");
const path = require("path");
const app = new express();
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => res.sendFile(__dirname + "/dist/index.html")); // send this file to port 4000
app.listen("4000"); // port that will show dist folder's data
