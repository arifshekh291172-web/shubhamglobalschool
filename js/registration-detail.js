const table = document.getElementById("studentTable");
const searchInput = document.getElementById("search");
const pageSizeSelect = document.getElementById("pageSize");
const pageNumbers = document.getElementById("pageNumbers");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentPage = 1;
let limit = parseInt(pageSizeSelect.value);
let totalPages = 1;

/* FETCH STUDENTS */
async function fetchStudents() {
    const search = searchInput.value;

    const res = await fetch(
        `https://shubhamglobalschool.onrender.com/api/students?page=${currentPage}&limit=${limit}&search=${search}`
    );
    return res.json();
}

/* RENDER TABLE */
async function renderTable() {
    const data = await fetchStudents();
    const students = data.students;

    totalPages = data.totalPages;
    table.innerHTML = "";

    students.forEach((s, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${(currentPage - 1) * limit + index + 1}</td>
            <td>${s.studentName}</td>
            <td>${s.studentAadhar}</td>
            <td>${new Date(s.createdAt).toLocaleDateString("en-IN")}</td>
            <td>
                <button class="action-btn" onclick="viewStudent('${s._id}')">
                    View
                </button>
            </td>
        `;
        table.appendChild(tr);
    });

    renderPagination();
}

/* PAGINATION NUMBERS */
function renderPagination() {
    pageNumbers.innerHTML = "";

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        if (i === currentPage) btn.classList.add("active");

        btn.addEventListener("click", () => {
            currentPage = i;
            renderTable();
        });

        pageNumbers.appendChild(btn);
    }
}

/* EVENTS */
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
});

pageSizeSelect.addEventListener("change", () => {
    limit = parseInt(pageSizeSelect.value);
    currentPage = 1;
    renderTable();
});

/* VIEW */
function viewStudent(id) {
    localStorage.setItem("studentId", id);
    window.location.href = "student-details.html";
}

/* INITIAL LOAD */
renderTable();
