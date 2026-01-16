const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===============================
   MIDDLEWARES
================================ */
app.use(cors({
    origin: "*",               // frontend alag ho to bhi chale
    credentials: true
}));
app.use(express.json({ limit: "10mb" })); // images buffer ke liye
app.use(express.urlencoded({ extended: true }));

/* ===============================
   ROUTES
================================ */

// Teacher Authentication
app.use("/api/teacher", require("./routes/teacherAuthRoutes"));

// Student Registration + Fetch
app.use("/api/students", require("./routes/studentRoutes"));

/* ===============================
   BASE ROUTE (TEST)
================================ */
app.get("/", (req, res) => {
    res.json({
        status: "OK",
        message: "SGS Backend API is running 🚀"
    });
});

/* ===============================
   DB CONNECT
================================ */
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Error:", err.message);
        process.exit(1);
    });

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
