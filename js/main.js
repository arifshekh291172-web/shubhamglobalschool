/* ======================================
   GLOBAL MAIN JS – SGS WEBSITE (FINAL)
====================================== */

/* ========= ELEMENTS ========= */
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const dropdowns = document.querySelectorAll(".dropdown");

/* ======================================
   MOBILE MENU TOGGLE
====================================== */
if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        menuToggle.textContent = navMenu.classList.contains("open") ? "✖" : "☰";
    });
}

/* ======================================
   MOBILE DROPDOWN TOGGLE
====================================== */
dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector("button");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (!trigger || !menu) return;

    trigger.addEventListener("click", e => {
        if (window.innerWidth <= 768) {
            e.preventDefault();

            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove("open");
                    const m = d.querySelector(".dropdown-menu");
                    if (m) m.style.maxHeight = null;
                }
            });

            dropdown.classList.toggle("open");
            menu.style.maxHeight = dropdown.classList.contains("open")
                ? menu.scrollHeight + "px"
                : null;
        }
    });
});

/* ======================================
   CLOSE MENU ON OUTSIDE CLICK
====================================== */
document.addEventListener("click", e => {
    if (
        navMenu &&
        !navMenu.contains(e.target) &&
        menuToggle &&
        !menuToggle.contains(e.target)
    ) {
        navMenu.classList.remove("open");
        if (menuToggle) menuToggle.textContent = "☰";

        dropdowns.forEach(d => {
            d.classList.remove("open");
            const dm = d.querySelector(".dropdown-menu");
            if (dm) dm.style.maxHeight = null;
        });
    }
});

/* ======================================
   ACTIVE NAV LINK
====================================== */
const currentPage = location.pathname.split("/").pop();
document.querySelectorAll(".nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});

/* ======================================
   SCROLL FADE-UP ANIMATION
====================================== */
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    { threshold: 0.15 }
);

document
    .querySelectorAll(".section, .card, .academic-card, .voice-card")
    .forEach(el => observer.observe(el));

/* ======================================
   ADVANCED GALLERY LIGHTBOX (ONLY ONE)
====================================== */
document.addEventListener("DOMContentLoaded", () => {

    const images = document.querySelectorAll(".card img");
    if (!images.length) return;

    let currentIndex = 0;
    let startX = 0;

    /* Create Lightbox */
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <span class="lightbox-prev">&#10094;</span>
        <img class="lightbox-img" src="">
        <span class="lightbox-next">&#10095;</span>
        <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);

    const imgEl = lightbox.querySelector(".lightbox-img");
    const caption = lightbox.querySelector(".lightbox-caption");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    const prevBtn = lightbox.querySelector(".lightbox-prev");

    function showImage() {
        imgEl.src = images[currentIndex].src;
        caption.textContent =
            images[currentIndex].nextElementSibling?.textContent || "";
    }

    images.forEach((img, index) => {
        img.addEventListener("click", () => {
            currentIndex = index;
            showImage();
            lightbox.classList.add("active");
        });
    });

    closeBtn.onclick = () => lightbox.classList.remove("active");

    nextBtn.onclick = () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage();
    };

    prevBtn.onclick = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage();
    };

    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) {
            lightbox.classList.remove("active");
        }
    });

    document.addEventListener("keydown", e => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") lightbox.classList.remove("active");
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "ArrowLeft") prevBtn.click();
    });

    /* Mobile Swipe */
    imgEl.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    imgEl.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (diff > 50) nextBtn.click();
        if (diff < -50) prevBtn.click();
    });
});

console.log("SGS main.js loaded cleanly");
