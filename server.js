const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/teacher", require("./routes/teacherAuthRoutes"));

/* DB Connect */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error(err));

app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on port ${process.env.PORT}`)
);
