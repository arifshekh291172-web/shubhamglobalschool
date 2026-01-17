document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("studentForm");
    const msg = document.getElementById("msg");
    const submitBtn = form.querySelector("button");

    /* ===============================
       HELPER FUNCTIONS
    =============================== */

    const showError = (text) => {
        msg.textContent = "❌ " + text;
        msg.className = "error";
    };

    const showSuccess = (text) => {
        msg.textContent = "✅ " + text;
        msg.className = "success";
    };

    const isValidAadhaar = (num) => /^\d{12}$/.test(num);

    /* ===============================
       🔐 GET teacherId FROM JWT TOKEN
    =============================== */
    const getTeacherIdFromToken = () => {
        const token = localStorage.getItem("teacherToken");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.id; // JWT payload me id hai
        } catch (err) {
            return null;
        }
    };

    /* ===============================
       FORM SUBMIT
    =============================== */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        msg.textContent = "";
        msg.className = "";

        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        try {
            const formData = new FormData(form);

            /* ===============================
               TEXT VALIDATION
            =============================== */
            const studentAadhar = formData.get("studentAadhar");
            const fatherAadhar = formData.get("fatherAadhar");
            const motherAadhar = formData.get("motherAadhar");

            if (!isValidAadhaar(studentAadhar))
                throw new Error("Student Aadhaar must be 12 digits");

            if (!isValidAadhaar(fatherAadhar))
                throw new Error("Father Aadhaar must be 12 digits");

            if (!isValidAadhaar(motherAadhar))
                throw new Error("Mother Aadhaar must be 12 digits");

            /* ===============================
               FILE VALIDATION
            =============================== */
            if (!formData.get("photo")?.name)
                throw new Error("Student photo is required");

            if (!formData.get("signature")?.name)
                throw new Error("Student signature is required");

            if (!formData.get("studentAadharPhoto")?.name)
                throw new Error("Student Aadhaar photo is required");

            if (!formData.get("fatherAadharPhoto")?.name)
                throw new Error("Father Aadhaar photo is required");

            if (!formData.get("motherAadharPhoto")?.name)
                throw new Error("Mother Aadhaar photo is required");

            /* ===============================
               🔥 ADD teacherId (FROM JWT)
            =============================== */
            const teacherId = getTeacherIdFromToken();
            if (!teacherId) {
                throw new Error("Teacher not logged in or token expired");
            }
            formData.append("teacherId", teacherId);

            /* ===============================
               API CALL
            =============================== */
            const res = await fetch(
                "https://shubhamglobalschool.onrender.com/api/students/register",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("teacherToken")
                    }
                }
            );

            let data;
            const contentType = res.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error("Server error (invalid response)");
            }

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            showSuccess(data.message || "Student registered successfully");
            form.reset();

        } catch (err) {
            showError(err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Register Student";
        }
    });
});
