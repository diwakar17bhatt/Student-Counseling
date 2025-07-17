require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const passport = require("passport");


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "mysecret",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL User Connected");
});

module.exports = db;

app.post("/api/save-user", (req, res) => {
  const { name, email } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).send("DB error");
    if (results.length > 0) return res.status(409).send("User already exists");

    const insert = "INSERT INTO users (name, email) VALUES (?, ?)";
    db.query(insert, [name, email], (err, result) => {
      if (err) return res.status(500).send("Insert error");
      res.status(200).send("User saved successfully");
    });
  });
});

app.post("/api/admin-enter", (req, res)=>{
  const {admin_email, admin_key} = req.body;
  const query = 'SELECT * FROM admins WHERE email = ? AND `key` = ?';
  db.query(query, [admin_email, admin_key] , (err, result) =>{
    if (err) {
      console.log(err);
      return res.status(500).send("DataBase error");
    }
    if (result.length === 0) {
      return res.status(401).send("invalid mail or pass");
    }
    res.status(200).json({
      message: "login success",
      user: result[0],
    });
  })
})

app.post("/api/student-form", (req, res) => {
  const {
    name,
    email,
    password,
    phno,
    gender,
    father_name,
    mother_name,
    address,
    maths_10,
    science_10,
    english_10,
    hindi_10,
    sst_10,
    it_10,
    physics_12,
    chemistry_12,
    maths_12,
  } = req.body;

  const query = `
    UPDATE users SET
      name = ?, password = ?, phone = ?, gender = ?,
      father_name = ?, mother_name = ?, address = ?,
      maths_10 = ?, science_10 = ?, english_10 = ?, hindi_10 = ?, sst_10 = ?, it_10 = ?,
      physics_12 = ?, chemistry_12 = ?, maths_12 = ?
    WHERE email = ?`;

  db.query(
    query,
    [
      name,
      password,
      phno,
      gender,
      father_name,
      mother_name,
      address,
      maths_10,
      science_10,
      english_10,
      hindi_10,
      sst_10,
      it_10,
      physics_12,
      chemistry_12,
      maths_12,
      email,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Insert error:", err);
        return res.status(500).send("insert error");
      }
      res.status(200).send("user saved successbully");
    }
  );
});

app.post("/api/check-user", (req, res) => {
  const { user_email, user_pass } = req.body;

  const query = " SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [user_email, user_pass], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("DataBase error");
    }
    if (result.length === 0) {
      return res.status(401).send("invalid mail or pass");
    }
    res.status(200).json({
      message: "login success",
      user: result[0],
    });
  });
});

app.listen(3000, () => {
  console.log("server is live");
});







app.post("/api/save-admins", (req, res) => {
  const { name, email, picture } = req.body;
  console.log("📥 Received admin data:", name, email); // 👈 log input

  const query = "SELECT * FROM admins WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("❌ DB error (SELECT):", err); // 👈 log error
      return res.status(500).send("DB error");
    }

    if (results.length > 0) {
      console.log("⚠️ Admin already exists");
      return res.status(409).send("Admin already exists");
    }

    const insert = "INSERT INTO admins (name, email, picture) VALUES (?, ?, ?)";
    db.query(insert, [name, email, picture], (err, result) => {
      if (err) {
        console.error("❌ Insert error:", err); // 👈 log error
        return res.status(500).send("Insert error");
      }
      console.log("✅ Admin inserted");
      res.status(200).send("Admin saved successfully");
    });
  });
});


app.get("/api/student-data", (req, res)=>{
  const query = 'SELECT * FROM users';
  db.query(query, (err, result)=>{
    if(err){
      return res.status(500).json({error: "Database Error"})
    }
    res.json(result)
  })
})

app.get("/api/student-rank", (req,res)=>{
  const query = 'SELECT * FROM users';
  db.query(query, (err, result)=>{
    if(err){
      return res.status(500).json({error: "Database Error"})
    }
    res.json(result)
  })
})

app.get("/api/student-rank-12", (req,res)=>{
  const query = 'SELECT * FROM users';
  db.query(query, (err, result)=>{
    if(err){
      return res.status(500).json({error: "Database Error"})
    }
    res.json(result)
  })
})

app.get("/api/student-rank-all", (req,res)=>{
  const query = 'SELECT * FROM users';
  db.query(query, (err, result)=>{
    if(err){
      return res.status(500).json({error: "Database Error"})
    }
    res.json(result)
  })
})

app.post("/api/update-allotments", (req, res) => {
  const updates = req.body.updates;

  if (!Array.isArray(updates)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  const sql = "UPDATE users SET allotment = ? WHERE email = ?";

  updates.forEach(({ email, allotment }) => {
    db.query(sql, [allotment, email], (err) => {
      if (err) {
        console.error(`Error updating ${email}:`, err);
      }
    });
  });

  res.json({ message: "All allotments updated successfully!" });
});

app.post("/api/allotment-display", (req, res)=>{
  const {email} = req.body;
  const query = `SELECT allotment FROM users WHERE email = ?`

  db.query(query, [email], (err, result)=>{
    if(err){
      return res.status(500).json({error: 'database error'})
    }
     res.status(200).json({
     
      user: result[0]
    });
  })

})