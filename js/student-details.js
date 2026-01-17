const studentId = localStorage.getItem("studentId");
const form = document.getElementById("studentForm");
const editBtn = document.getElementById("editBtn");
const cancelBtn = document.getElementById("cancelBtn");
const actionBtns = document.getElementById("actionBtns");

let originalData = {};
let editMode = false;

const editableFields = [
    "studentName",
    "lastSchool",
    "boardName",
    "qualification"
];

if (!studentId) {
    alert("No student selected");
    window.location.href = "registration-detail.html";
}

/* Load student */
async function loadStudent() {
    const res = await fetch(`https://shubhamglobalschool.onrender.com/api/students/${studentId}`);
    const s = await res.json();

    originalData = s;

    studentName.value = s.studentName || "";
    studentAadhar.value = s.studentAadhar || "";
    dob.value = s.dob ? s.dob.split("T")[0] : "";

    fatherName.value = s.fatherName || "";
    motherName.value = s.motherName || "";

    lastSchool.value = s.lastSchool || "";
    boardName.value = s.boardName || "";
    qualification.value = s.qualification || "";

    setReadOnly();
}

/* Modes */
function setReadOnly() {
    editableFields.forEach(id => {
        document.getElementById(id).disabled = true;
    });
    actionBtns.classList.add("hidden");
    editMode = false;
}

function setEditable() {
    editableFields.forEach(id => {
        document.getElementById(id).disabled = false;
    });
    actionBtns.classList.remove("hidden");
    editMode = true;
}

/* Buttons */
editBtn.addEventListener("click", () => setEditable());

cancelBtn.addEventListener("click", () => {
    studentName.value = originalData.studentName || "";
    lastSchool.value = originalData.lastSchool || "";
    boardName.value = originalData.boardName || "";
    qualification.value = originalData.qualification || "";
    setReadOnly();
});

/* Save */
form.addEventListener("submit", async e => {
    e.preventDefault();

    await fetch(`https://shubhamglobalschool.onrender.com/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            studentName: studentName.value,
            lastSchool: lastSchool.value,
            boardName: boardName.value,
            qualification: qualification.value
        })
    });

    alert("Student updated successfully");
    loadStudent();
});

/* Navigation */
function goBack() {
    window.location.href = "registration-detail.html";
}

/* Document Preview */
function previewDoc(type) {
    const modal = document.getElementById("docModal");
    const img = document.getElementById("docImage");
    img.src = `https://shubhamglobalschool.onrender.com/api/students/${studentId}/document/${type}`;
    modal.classList.remove("hidden");
}

function closeModal() {
    document.getElementById("docModal").classList.add("hidden");
}

loadStudent();
