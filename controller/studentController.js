const Student = require("../models/Student");

exports.registerStudent = async (req, res) => {
  try {
    if (!req.files)
      return res.status(400).json({ message: "Files missing" });

    const getFile = (name) => {
      const file = req.files[name]?.[0];
      if (!file) throw new Error(`${name} missing`);
      return {
        data: file.buffer,
        contentType: file.mimetype
      };
    };

    const student = new Student({
      studentName: req.body.studentName,
      studentAadhar: req.body.studentAadhar,
      dob: req.body.dob,

      fatherName: req.body.fatherName,
      fatherAadhar: req.body.fatherAadhar,

      motherName: req.body.motherName,
      motherAadhar: req.body.motherAadhar,

      lastSchool: req.body.lastSchool,
      boardName: req.body.boardName,
      qualification: req.body.qualification,

      studentPhoto: getFile("photo"),
      studentSignature: getFile("signature"),
      studentAadharPhoto: getFile("studentAadharPhoto"),
      fatherAadharPhoto: getFile("fatherAadharPhoto"),
      motherAadharPhoto: getFile("motherAadharPhoto"),

      createdByTeacher: req.user.id
    });

    await student.save();

    res.status(201).json({ message: "Student registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
