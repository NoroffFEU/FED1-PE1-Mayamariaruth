import "./add.js";
import "./api.js";
import "./auth.js";
import "./edit.js";
import "./feed.js";
import "./post.js";

// Toggle mobile hamburger menu overlay visibility
const hamburger = document.getElementById("hamburger");
const nav = document.querySelector("nav");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("nav-active");
});
