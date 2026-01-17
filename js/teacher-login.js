const form = document.getElementById("loginForm");
const btn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async e => {
    e.preventDefault();
    errorMsg.textContent = "";
    btn.classList.add("loading");
    btn.disabled = true;

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const res = await fetch("https://shubhamglobalschool.onrender.com/api/teacher/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Login failed");
        }

        // Save token
        localStorage.setItem("teacherToken", data.token);

        // Redirect
        window.location.href = "teacher-dashboard.html";

    } catch (err) {
        errorMsg.textContent = err.message;
    } finally {
        btn.classList.remove("loading");
        btn.disabled = false;
    }
});
