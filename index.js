const express = require("express");
require("dotenv").config();
const app = express();
const _mysql = require("./config/db.js");

const connection = await _mysql.connectDB();

// Set Pug as the templating engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Route to render a Pug template with data (replace with your logic)
app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/db_seed", async (req, res) => {
  const argon2 = require("argon2");

  try {
    const hash = await argon2.hash("password");
    connection.execute(
      "insert into users (name, email, password) values (?,?,?)",
      ["Tijan", "tijanmdr@gmail.com", hash],
      (err, rows) => {
        console.log(err, rows);
      }
    );
  } catch (err) {
    //...
  }
});

app.get("/check", async (req, res) => {
  const argon = require("argon2");

  connection.execute(
    "select * from users where email=?",
    ["tijanmdr@gmail.com"],
    (err, rows) => {
      console.log(123);
      return res.json(rows);
    }
  );
  console.log("this s");
  return res.json({ message: "working" });

  // if (await argon.verify("<big long hash>", "password")) {
  //   // password match
  // } else {
  //   // password did not match
  // }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
