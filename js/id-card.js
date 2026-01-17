function preview(input, id) {
    const file = input.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = e => document.getElementById(id).src = e.target.result;
    r.readAsDataURL(file);
}

photo.onchange = () => preview(photo, "cPhoto");
signature.onchange = () => preview(signature, "cSign");

["studentName", "fatherName", "motherName", "className", "rollNo", "dob", "contact"]
    .forEach(i => {
        document.getElementById(i).addEventListener("input", () => {
            cName.textContent = studentName.value || "Student Name";
            cFather.textContent = fatherName.value;
            cMother.textContent = motherName.value;
            cClass.textContent = className.value;
            cRoll.textContent = rollNo.value;
            cDob.textContent = dob.value;
            cContact.textContent = contact.value;
            cContact2.textContent = contact.value;
        });
    });

function downloadID() {
    html2canvas(idCard).then(c => {
        const a = document.createElement("a");
        a.download = "student-id-card.png";
        a.href = c.toDataURL();
        a.click();
    });
}
