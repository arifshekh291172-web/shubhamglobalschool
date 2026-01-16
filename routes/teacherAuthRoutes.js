/* ======================================
   TEACHER AUTH ROUTES – SGS
====================================== */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Teacher = require("../models/Teacher");

/* ======================================
   CREATE TEACHER (ADMIN / SETUP ONLY)
   POST /api/teacher/create
====================================== */
router.post("/create", async (req, res) => {
    try {
        const { name, email, password, subject, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(409).json({
                success: false,
                message: "Teacher already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = await Teacher.create({
            name,
            email,
            password: hashedPassword,
            subject,
            phone
        });

        res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

/* ======================================
   TEACHER LOGIN
   POST /api/teacher/login
====================================== */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }

        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: teacher._id,
                role: teacher.role
            },
            process.env.JWT_SECRET || "sgs_secret_key",
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

/* ======================================
   AUTH MIDDLEWARE
====================================== */
const teacherAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "sgs_secret_key"
        );

        req.teacher = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

/* ======================================
   TEACHER PROFILE (PROTECTED)
   GET /api/teacher/profile
====================================== */
router.get("/profile", teacherAuth, async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.teacher.id).select("-password");

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.json({
            success: true,
            teacher
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

/* ======================================
   LOGOUT (CLIENT SIDE TOKEN CLEAR)
====================================== */
router.post("/logout", (req, res) => {
    res.json({
        success: true,
        message: "Logout successful (clear token on client)"
    });
});

module.exports = router;
