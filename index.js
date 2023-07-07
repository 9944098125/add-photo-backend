const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mySql = require("mysql2");

const app = express();

const db = mySql.createPool({
  host: "localhost",
  user: "root",
  password: "Srinivas@8",
  database: "add_photo",
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/post-users", (req, res) => {
  const { name, email, photo } = req.body;
  const sql = "INSERT INTO users (name, email, photo) VALUES (?, ?, ?)";
  db.query(sql, [name, email, photo], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "Something went wrong" });
    } else if (result.affectedRows > 0) {
      // console.log(result);
      res.status(201).json({ message: "User created successfully" });
    }
  });
});

app.get("/api/get-users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    // console.log(result);
    if (err) {
      return res.status(400).json({ message: "Something went wrong" });
    } else {
      res
        .status(200)
        .json({ message: "Users fetched successfully", users: result });
    }
  });
});

app.listen(4000, () => console.log(`App is now running on port 4000`));
