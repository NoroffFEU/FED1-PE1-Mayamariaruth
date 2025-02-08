import "./add.js";
import "./api.js";
import "./auth.js";
import "./edit.js";
import "./feed.js";
import "./post.js";

// Toggle mobile hamburger menu overlay visibility
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector("nav");
  const mobileNav = document.querySelector(".mobile-nav");

  hamburger.addEventListener("click", function () {
    nav.classList.toggle("nav-active");
    mobileNav.classList.toggle("nav-active");

    // Toggle between hamburger and close icon
    if (nav.classList.contains("nav-active")) {
      hamburger.classList.remove("fa-bars");
      hamburger.classList.add("fa-xmark");
    } else {
      hamburger.classList.remove("fa-xmark");
      hamburger.classList.add("fa-bars");
    }
  });
});
