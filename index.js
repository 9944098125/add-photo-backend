const express = require("express");
const multer = require("multer");
const mySql = require("mysql2/promise");
const fs = require("fs");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

const pool = mySql.createPool({
  host: "localhost",
  user: "root",
  password: "Srinivas@8",
  database: "add_photo",
});

app.use(cors());

// Handle image upload
app.post("/upload", upload.single("image"), async (req, res) => {
  const { name, email } = req.body;
  const imagePath = req.file.path;

  try {
    // Read the image file as binary data
    const imageBuffer = await fs.promises.readFile(imagePath);

    // Insert the data into the database
    const insertQuery =
      "INSERT INTO users (name, email, image) VALUES (?, ?, ?)";
    await pool.query(insertQuery, [name, email, imageBuffer]);

    res.status(200).json({ message: "Image uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve user data with images
app.get("/users", async (req, res) => {
  try {
    const selectQuery = "SELECT id, name, email, image FROM users";
    const [rows] = await pool.query(selectQuery);

    // Convert image data to Base64-encoded string
    const users = await Promise.all(
      rows.map(async (row) => {
        const user = { ...row };
        console.log(row);

        if (row) {
          user.image = row.image.toString("base64");
        }
        // console.log(user);
        return user;
      })
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
