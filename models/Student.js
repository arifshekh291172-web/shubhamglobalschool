const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
    {
        /* ===============================
           STUDENT DETAILS
        =============================== */
        studentName: {
            type: String,
            required: true,
            trim: true
        },

        studentAadhar: {
            type: String,
            required: true,
            unique: true,
            match: /^\d{12}$/
        },

        dob: {
            type: Date,
            required: true
        },

        /* ===============================
           PARENTS DETAILS
        =============================== */
        fatherName: {
            type: String,
            required: true,
            trim: true
        },

        fatherAadhar: {
            type: String,
            required: true,
            match: /^\d{12}$/
        },

        motherName: {
            type: String,
            required: true,
            trim: true
        },

        motherAadhar: {
            type: String,
            required: true,
            match: /^\d{12}$/
        },

        /* ===============================
           ACADEMIC DETAILS
        =============================== */
        lastSchool: {
            type: String,
            required: true
        },

        boardName: {
            type: String,
            required: true
        },

        qualification: {
            type: String,
            required: true
        },

        /* ===============================
           DOCUMENTS (BUFFER STORAGE)
           👉 NO FILE SYSTEM
        =============================== */
        studentPhoto: {
            data: Buffer,
            contentType: String,
            required: true
        },

        studentSignature: {
            data: Buffer,
            contentType: String,
            required: true
        },

        studentAadharPhoto: {
            data: Buffer,
            contentType: String,
            required: true
        },

        fatherAadharPhoto: {
            data: Buffer,
            contentType: String,
            required: true
        },

        motherAadharPhoto: {
            data: Buffer,
            contentType: String,
            required: true
        },

        /* ===============================
           META
        =============================== */
        createdByTeacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", StudentSchema);
