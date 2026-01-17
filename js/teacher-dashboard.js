// ================= AUTH CHECK =================
const token = localStorage.getItem("teacherToken");
if (!token) {
    location.href = "teacher-login.html";
}

// ================= ELEMENTS =================
const loader = document.getElementById("loader");
const studentCountEl = document.getElementById("studentCount");
const logoutBtn = document.getElementById("logoutBtn");
const teacherNameEl = document.getElementById("teacherName");

// ================= LOADER =================
function showLoader(show = true) {
    loader.style.display = show ? "flex" : "none";
}

// ================= LOAD TEACHER INFO =================
function loadTeacherInfo() {
    const name = localStorage.getItem("teacherName");
    if (name) teacherNameEl.textContent = name;
}

// ================= LOAD STUDENT COUNT =================
async function loadStudentCount() {
    try {
        showLoader(true);

        const res = await fetch("https://shubhamglobalschool.onrender.com/api/students/count", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            studentCountEl.textContent = data.total;
        } else {
            studentCountEl.textContent = "—";
        }
    } catch (err) {
        studentCountEl.textContent = "—";
        console.error(err);
    } finally {
        showLoader(false);
    }
}

// ================= LOGOUT =================
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("teacherToken");
    localStorage.removeItem("teacherName");
    location.href = "teacher-login.html";
});

// ================= INIT =================
loadTeacherInfo();
loadStudentCount();
