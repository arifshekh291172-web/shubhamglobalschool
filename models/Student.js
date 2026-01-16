const mongoose = require("mongoose");

/* ======================================
   SUB-SCHEMA FOR FILE STORAGE
====================================== */
const fileSchema = new mongoose.Schema(
    {
        data: {
            type: Buffer,
            required: true
        },
        contentType: {
            type: String,
            required: true
        }
    },
    { _id: false } // prevents extra _id for each file object
);

/* ======================================
   STUDENT SCHEMA
====================================== */
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
            match: [/^\d{12}$/, "Invalid Aadhar number"]
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
            match: [/^\d{12}$/, "Invalid Aadhar number"]
        },

        motherName: {
            type: String,
            required: true,
            trim: true
        },

        motherAadhar: {
            type: String,
            required: true,
            match: [/^\d{12}$/, "Invalid Aadhar number"]
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
        =============================== */
        studentPhoto: {
            type: fileSchema,
            required: true
        },

        studentSignature: {
            type: fileSchema,
            required: true
        },

        studentAadharPhoto: {
            type: fileSchema,
            required: true
        },

        fatherAadharPhoto: {
            type: fileSchema,
            required: true
        },

        motherAadharPhoto: {
            type: fileSchema,
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
