const express = require("express");
const router = express.Router();
const multer = require("multer");

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

/* ===============================
   MULTER CONFIG (MEMORY STORAGE)
=============================== */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/* =====================================================
   STUDENT REGISTRATION
===================================================== */
router.post(
    "/register",
    upload.fields([
        { name: "photo", maxCount: 1 },
        { name: "signature", maxCount: 1 },
        { name: "studentAadharPhoto", maxCount: 1 }, // ✅ FIXED
        { name: "fatherAadharPhoto", maxCount: 1 },
        { name: "motherAadharPhoto", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const {
                studentName,
                studentAadhar,
                fatherName,
                fatherAadhar,
                motherName,
                motherAadhar,
                dob,
                lastSchool,
                boardName,
                qualification,
                teacherId
            } = req.body;

            /* ---------- BASIC VALIDATION ---------- */
            if (
                !studentName ||
                !studentAadhar ||
                !fatherName ||
                !fatherAadhar ||
                !motherName ||
                !motherAadhar ||
                !dob ||
                !lastSchool ||
                !boardName ||
                !qualification ||
                !teacherId
            ) {
                return res.status(400).json({
                    message: "All fields are mandatory"
                });
            }

            if (
                studentAadhar.length !== 12 ||
                fatherAadhar.length !== 12 ||
                motherAadhar.length !== 12
            ) {
                return res.status(400).json({
                    message: "Aadhaar number must be 12 digits"
                });
            }

            /* ---------- FILE VALIDATION ---------- */
            if (
                !req.files?.photo ||
                !req.files?.signature ||
                !req.files?.studentAadharPhoto ||
                !req.files?.fatherAadharPhoto ||
                !req.files?.motherAadharPhoto
            ) {
                return res.status(400).json({
                    message: "All document images are required"
                });
            }

            /* ---------- TEACHER CHECK ---------- */
            const teacher = await Teacher.findById(teacherId);
            if (!teacher) {
                return res.status(401).json({
                    message: "Unauthorized teacher"
                });
            }

            /* ---------- DUPLICATE STUDENT CHECK ---------- */
            const existing = await Student.findOne({ studentAadhar });
            if (existing) {
                return res.status(409).json({
                    message: "Student already registered"
                });
            }

            /* ---------- CREATE STUDENT ---------- */
            const student = new Student({
                studentName,
                studentAadhar,
                dob,

                fatherName,
                fatherAadhar,

                motherName,
                motherAadhar,

                lastSchool,
                boardName,
                qualification,

                studentPhoto: {
                    data: req.files.photo[0].buffer,
                    contentType: req.files.photo[0].mimetype
                },
                studentSignature: {
                    data: req.files.signature[0].buffer,
                    contentType: req.files.signature[0].mimetype
                },
                studentAadharPhoto: {
                    data: req.files.studentAadharPhoto[0].buffer,
                    contentType: req.files.studentAadharPhoto[0].mimetype
                },
                fatherAadharPhoto: {
                    data: req.files.fatherAadharPhoto[0].buffer,
                    contentType: req.files.fatherAadharPhoto[0].mimetype
                },
                motherAadharPhoto: {
                    data: req.files.motherAadharPhoto[0].buffer,
                    contentType: req.files.motherAadharPhoto[0].mimetype
                },

                createdByTeacher: teacherId
            });

            await student.save();

            return res.status(201).json({
                message: "Student registered successfully",
                studentId: student._id
            });

        } catch (err) {
            console.error("Registration Error:", err);
            return res.status(500).json({
                message: err.message || "Server error"
            });
        }
    }
);

/* =====================================================
   GET ALL STUDENTS (PAGINATION + SEARCH)
===================================================== */
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || "";

        const query = search
            ? { studentName: { $regex: search, $options: "i" } }
            : {};

        const total = await Student.countDocuments(query);

        const students = await Student.find(query)
            .select("studentName studentAadhar createdAt")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            students,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching students" });
    }
});

/* =====================================================
   STUDENT COUNT
===================================================== */
router.get("/count", async (req, res) => {
    try {
        const count = await Student.countDocuments();
        res.json({ totalStudents: count });
    } catch (err) {
        res.status(500).json({ message: "Error fetching count" });
    }
});

/* =====================================================
   GET SINGLE STUDENT (WITHOUT BUFFERS)
===================================================== */
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select(
            "-studentPhoto -studentSignature -studentAadharPhoto -fatherAadharPhoto -motherAadharPhoto"
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (err) {
        res.status(500).json({ message: "Error fetching student" });
    }
});

/* =====================================================
   DOCUMENT PREVIEW
===================================================== */
router.get("/:id/document/:type", async (req, res) => {
    try {
        const { id, type } = req.params;

        const allowedTypes = [
            "studentPhoto",
            "studentSignature",
            "studentAadharPhoto",
            "fatherAadharPhoto",
            "motherAadharPhoto"
        ];

        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid document type" });
        }

        const student = await Student.findById(id).select(type);

        if (!student || !student[type]) {
            return res.status(404).json({ message: "Document not found" });
        }

        res.set("Content-Type", student[type].contentType);
        res.send(student[type].data);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
