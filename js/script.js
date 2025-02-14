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
  const headerNav = document.querySelector(".header-nav");

  hamburger.addEventListener("click", function () {
    nav.classList.toggle("nav-active");
    headerNav.classList.toggle("nav-active");

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

// Display search bar in desktop nav bar
document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.querySelector(".search-icon");
  const searchOverlay = document.getElementById("search-overlay");
  const searchInput = document.getElementById("search-input");

  // Open search overlay
  searchIcon.addEventListener("click", (e) => {
    e.preventDefault();
    searchOverlay.classList.add("active");
    searchInput.focus();
  });

  // Close search overlay when clicking outside
  document.addEventListener("click", (e) => {
    if (!searchOverlay.contains(e.target) && e.target !== searchIcon) {
      searchOverlay.classList.remove("active");
    }
  });

  // Prevent closing when clicking inside the overlay or input
  searchOverlay.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

// Initialize Quill editor
var quill = new Quill("#editor", {
  theme: "snow",
  placeholder: "Start writing your blog post here...",
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["link", "blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  },
});

// Store editor content in the hidden input when submitting
document.getElementById("blogForm").addEventListener("submit", function () {
  document.getElementById("content").value = quill.root.innerHTML;
});
