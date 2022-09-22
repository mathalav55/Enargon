const express = require("express");
const lpgController = require("./lpg/lpgController");
const db = require("./db");
const app = express();
const path = require("path");
const exp = require("constants");

console.log(path.join(__dirname, "./public"));
const publicPath = path.join(__dirname, "./public");
//json data handling
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.static(publicPath));


app.use("/lpg", lpgController);
app.use("/home", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
//bad entry error handling
app.use("/", (req, res, next) => {
  const err = new Error("not found");
  err.status = 404;
  next(err);
})
//error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});

module.exports = app;
