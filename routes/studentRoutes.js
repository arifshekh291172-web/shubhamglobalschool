const express = require("express");
const router = express.Router();
const multer = require("multer");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher"); // auth ke liye

/* ===============================
   MULTER (MEMORY STORAGE)
   👉 files disk pe save nahi honge
=============================== */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/* ===============================
   STUDENT REGISTRATION
=============================== */
router.post(
    "/register",
    upload.fields([
        { name: "photo", maxCount: 1 },
        { name: "signature", maxCount: 1 },
        { name: "aadharPhoto", maxCount: 1 },
        { name: "fatherAadharPhoto", maxCount: 1 },
        { name: "motherAadharPhoto", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            /* ===============================
               BASIC BODY DATA
            =============================== */
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

            /* ===============================
               VALIDATION
            =============================== */
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

            /* ===============================
               FILE VALIDATION
            =============================== */
            if (
                !req.files?.photo ||
                !req.files?.signature ||
                !req.files?.aadharPhoto ||
                !req.files?.fatherAadharPhoto ||
                !req.files?.motherAadharPhoto
            ) {
                return res.status(400).json({
                    message: "All document images are required"
                });
            }

            /* ===============================
               CHECK TEACHER EXISTS
            =============================== */
            const teacher = await Teacher.findById(teacherId);
            if (!teacher) {
                return res.status(401).json({
                    message: "Unauthorized teacher"
                });
            }

            /* ===============================
               DUPLICATE STUDENT CHECK
            =============================== */
            const existing = await Student.findOne({
                studentAadhar
            });

            if (existing) {
                return res.status(409).json({
                    message: "Student already registered"
                });
            }

            /* ===============================
               CREATE STUDENT
            =============================== */
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
                    data: req.files.aadharPhoto[0].buffer,
                    contentType: req.files.aadharPhoto[0].mimetype
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

        } catch (error) {
            console.error("Student Registration Error:", error);
            return res.status(500).json({
                message: "Server error"
            });
        }
    }
);

/* ===============================
   STUDENT COUNT (DASHBOARD)
=============================== */
router.get("/count", async (req, res) => {
    try {
        const count = await Student.countDocuments();
        res.json({ totalStudents: count });
    } catch (err) {
        res.status(500).json({ message: "Error fetching count" });
    }
});

module.exports = router;
