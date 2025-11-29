// =========================================================
// PRELOADER — Fade out when page fully loads or after timeout
// =========================================================
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("hide");
    setTimeout(() => preloader.remove(), 600); // remove after fade
  }
});

// Failsafe: hide preloader after 4.5s even if load event is slow
setTimeout(() => {
  const preloader = document.getElementById("preloader");
  if (preloader && !preloader.classList.contains("hide")) {
    preloader.classList.add("hide");
    setTimeout(() => preloader.remove(), 600);
  }
}, 4500);


// =========================================================
// SCROLL PROGRESS BAR
// =========================================================
const progressBar = document.createElement("div");
progressBar.setAttribute("aria-hidden", "true");
Object.assign(progressBar.style, {
  position: "fixed",
  top: "0",
  left: "0",
  height: "3px",
  width: "0",
  zIndex: "1200",
  background: "linear-gradient(90deg, rgba(131,188,169,1), rgba(16,46,74,1))",
  transformOrigin: "left center",
  transition: "width 0.15s ease-out"
});
document.body.appendChild(progressBar);

function updateScrollProgress() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  progressBar.style.width = `${scrolled}%`;
}
["scroll", "resize"].forEach(evt => window.addEventListener(evt, () => requestAnimationFrame(updateScrollProgress)));
updateScrollProgress();


// =========================================================
// BACK TO TOP BUTTON
// =========================================================
const backToTop = document.createElement("button");
backToTop.type = "button";
backToTop.innerHTML = "↑";
backToTop.setAttribute("aria-label", "Back to top");
Object.assign(backToTop.style, {
  position: "fixed",
  right: "1.6rem",
  bottom: "1.6rem",
  width: "40px",
  height: "40px",
  borderRadius: "999px",
  border: "1px solid rgba(148,163,184,0.5)",
  background: "radial-gradient(circle at top left, rgba(131,188,169,0.3), rgba(15,23,42,0.95))",
  color: "#e5e7eb",
  boxShadow: "0 14px 26px rgba(0,0,0,0.6)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1rem",
  opacity: "0",
  transform: "translateY(12px)",
  pointerEvents: "none",
  transition: "opacity 0.25s ease, transform 0.25s ease",
  zIndex: "1200"
});
document.body.appendChild(backToTop);

function toggleBackToTop() {
  if (window.scrollY > 350) {
    backToTop.style.opacity = "1";
    backToTop.style.transform = "translateY(0)";
    backToTop.style.pointerEvents = "auto";
  } else {
    backToTop.style.opacity = "0";
    backToTop.style.transform = "translateY(12px)";
    backToTop.style.pointerEvents = "none";
  }
}
window.addEventListener("scroll", () => requestAnimationFrame(toggleBackToTop));

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));


// =========================================================
// SCROLL REVEAL ANIMATIONS
// =========================================================
const revealTargets = document.querySelectorAll(
  ".section, .resource-card, .service-list li, .contact-info, #contact-form"
);

document.querySelectorAll(".section").forEach(section => {
  const children = section.querySelectorAll(".resource-card, .service-list li, .contact-info, #contact-form");
  children.forEach((el, index) => el.style.transitionDelay = `${0.08 * (index + 1)}s`);
});

const revealOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });

revealTargets.forEach(target => revealOnScroll.observe(target));


// =========================================================
// MOBILE NAV — Hamburger toggle
// =========================================================
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("main-nav");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navToggle.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    if (navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  }));
}


// =========================================================
// BACKGROUND CROSSFADE — Smooth + subtle parallax scroll
// =========================================================
const bgImages = ["pic1.jpg","pic2.jpg","pic3.avif","pic4.avif","pic5.avif","pic6.avif"];
let bgIndex = 0;

// preload
bgImages.forEach(src => new Image().src = src);

const bgContainer = document.createElement("div");
Object.assign(bgContainer.style, {
  position: "fixed", inset: "0", zIndex: "-20", overflow: "hidden", pointerEvents: "none"
});
document.body.appendChild(bgContainer);

const dimLayer = document.createElement("div");
Object.assign(dimLayer.style, { position: "absolute", inset: "0", background: "#000", opacity: "0.78", zIndex: "0", transition: "opacity 0.4s ease-out" });
bgContainer.appendChild(dimLayer);

const [bg1, bg2] = [document.createElement("div"), document.createElement("div")];
[bg1, bg2].forEach(bg => {
  Object.assign(bg.style, {
    position: "absolute", inset: "0",
    backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
    transition: "opacity 2.2s ease, transform 6s ease-out",
    opacity: "0", zIndex: "1", transform: "scale(1.04)"
  });
  bgContainer.appendChild(bg);
});

bg1.style.backgroundImage = `url(${bgImages[0]})`;
bg1.style.opacity = "1";
bgIndex = 1;

function showNextBg() {
  const current = bgIndex % 2 === 0 ? bg2 : bg1;
  const next = bgIndex % 2 === 0 ? bg1 : bg2;
  next.style.backgroundImage = `url(${bgImages[bgIndex]})`;
  next.style.opacity = "0";
  next.style.transform = "scale(1.04)";
  requestAnimationFrame(() => {
    current.style.opacity = "0";
    current.style.transform = "scale(1.08)";
    next.style.opacity = "1";
    next.style.transform = "scale(1.04)";
    bgIndex = (bgIndex + 1) % bgImages.length;
  });
}
setInterval(showNextBg, 6000);

// scroll-driven dim adjustment
window.addEventListener("scroll", () => {
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const ratio = window.scrollY / max;
  dimLayer.style.opacity = (0.78 + ratio * 0.06).toFixed(2);
});
revealTargets.forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
  revealOnScroll.observe(el);
});
const navLinks = document.querySelectorAll("nav.nav-links a");
navLinks.forEach((link, i) => {
  link.style.opacity = 0;
  link.style.transform = "translateY(-20px)";
  setTimeout(() => {
    link.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    link.style.opacity = 1;
    link.style.transform = "translateY(0)";
  }, i * 100); // staggered
});
const hero = document.querySelector(".hero-content");
hero.classList.add("in-view"); // triggers pop immediately
/* ===========================
   HERO TEXT ROTATORS
=========================== */

const headingTexts = [
  "Welcome!",
  "Hello There!",
  "Explore My Portfolio",
  "Your Go-To Knowledge Partner",
  "Crafting Insightful Articles",
  "High-Impact Writing",
  "Finance, Technology, Strategy",
  "Market Observer",
  "Idea Machine!",
];

const paragraphTexts = [
  "Discover creativity, work samples, and insights — all in one place.",
  "Delivering well-researched insights on blockchain, Web3, and digital finance.",
  "Let's create something exceptional together.",
  "Turning ideas into responsive, beautiful interfaces.",
  "Helping brands communicate the future of decentralized technology.",
  "Scroll down to explore more."
];

const headingEl = document.getElementById("rotate-heading");
const paragraphEl = document.getElementById("rotate-paragraph");

let headIndex = 0;
let paraIndex = 0;

// Reusable fade + swap function
function rotateContent(el, array, indexCallback) {
  el.style.opacity = 0;

  setTimeout(() => {
    const idx = indexCallback();
    el.textContent = array[idx];
    el.style.opacity = 1;
  }, 600);
}

// Heading rotation
if (headingEl) {
  setInterval(() => {
    rotateContent(headingEl, headingTexts, () => {
      headIndex = (headIndex + 1) % headingTexts.length;
      return headIndex;
    });
  }, 2500);
}

// Paragraph rotation
if (paragraphEl) {
  setInterval(() => {
    rotateContent(paragraphEl, paragraphTexts, () => {
      paraIndex = (paraIndex + 1) % paragraphTexts.length;
      return paraIndex;
    });
  }, 3200); // slightly different timing for a natural feel
}
// Target the form
const contactForm = document.getElementById("contact-form");

// Listen for form submission
contactForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default submission

  // Get form values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();
  const question = document.getElementById("question").value.trim();

  // Basic validation
  if (!name || !email || !subject || !message) {
    showPopup("⚠️ Please fill in all fields.", "error");
    return;
  }

  // Security question check
  if (question !== "15") {
    showPopup("❌ Incorrect answer to the security question.", "error");
    return;
  }

  // All good — show success message
  showPopup(`✅ Message sent successfully! Thank you, ${name}.`, "success");

  // Optional: reset form
  contactForm.reset();
});

// 🔔 Popup notification function
function showPopup(message, type) {
  const popup = document.createElement("div");
  popup.className = `popup-message ${type}`;
  popup.textContent = message;
  document.body.appendChild(popup);

  // Add show class to trigger CSS animation
  setTimeout(() => {
    popup.classList.add("show");
  }, 50);

  // Remove popup after 3 seconds
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}
