import "./add.js";
import "./api.js";
import "./auth.js";
import "./edit.js";
import "./feed.js";
import "./post.js";

// Navbar functionality
document.addEventListener("DOMContentLoaded", function () {
  // Toggle mobile hamburger menu overlay visibility
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

  // Display search bar in desktop nav bar
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

  // Prevent closing when clicking inside the search overlay
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) {
      e.stopPropagation();
    }
  });
});

// Initialize Quill editor
document.addEventListener("DOMContentLoaded", function () {
  const editorContainer = document.getElementById("editor");
  if (editorContainer) {
    var quill = new Quill("#editor", {
      theme: "snow",
      placeholder: "Start writing your blog post here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          ["link", "blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
        ],
      },
    });

    // Handle Add and Edit forms
    const addForm = document.getElementById("add-form");
    const editForm = document.getElementById("edit-form");

    if (addForm) {
      addForm.addEventListener("submit", function () {
        document.getElementById("content").value = quill.root.innerHTML;
      });
    }

    if (editForm) {
      editForm.addEventListener("submit", function () {
        document.getElementById("content").value = quill.root.innerHTML;
      });
    }
  }
});

// Display notifications function
export function showNotification(message, type = "success") {
  const notificationContainer = document.getElementById("notifications");
  if (!notificationContainer) return;

  // Icons for success/error
  const icons = {
    success: '<i class="fa-solid fa-circle-check"></i>',
    error: '<i class="fa-solid fa-triangle-exclamation"></i>',
  };

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-left">
      <span class="icon">${icons[type]}</span>
        <div class="notification-content">
          <h4 class="notification-heading">${
            type === "success" ? "Success!" : "Error!"
          }</h4>
          <p class="notification-message">${message}</p>
        </div>
    </div>
    <button class="close-btn"><i class="fa-solid fa-xmark"></i></button>
  `;

  notification.querySelector(".close-btn").addEventListener("click", () => {
    notification.remove();
  });

  notificationContainer.appendChild(notification);

  setTimeout(() => {
    if (notification) notification.remove();
  }, 5000);
}

// Home page hero buttons link
document.addEventListener("DOMContentLoaded", () => {
  const heroBtn = document.querySelector(".hero-btn");
  const loginBtn = document.querySelector(".login-btn");

  if (heroBtn) {
    heroBtn.addEventListener("click", () => {
      window.location.href = "/templates/post/feed.html";
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/templates/account/login.html";
    });
  }
});

// Restrict access to edit/add pages for only logged in users
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const currentPage = window.location.pathname;

  if ((currentPage.includes("add") || currentPage.includes("edit")) && !token) {
    window.location.href = "../account/login.html";
  }
});
