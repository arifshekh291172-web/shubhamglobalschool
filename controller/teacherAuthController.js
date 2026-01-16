const Teacher = require("../models/Teacher");
const bcrypt = require("bcryptjs");

/* ===============================
   CREATE TEACHER (ADMIN / SCRIPT)
================================ */
exports.createTeacher = async (req, res) => {
    try {
        const { name, email, password, subject, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All required fields missing"
            });
        }

        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(409).json({
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
            message: "Teacher created successfully",
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
