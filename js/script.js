import "./add.js";
import "./api.js";
import "./auth.js";
import "./edit.js";
import "./feed.js";
import "./post.js";

// Mobile navbar functionality
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
});

// Initialize Quill editor
export let quill;
document.addEventListener("DOMContentLoaded", function () {
  const editorContainer = document.getElementById("editor");
  if (editorContainer) {
    quill = new Quill("#editor", {
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
        document.getElementById("body").value = quill.root.innerHTML;
      });
    }

    if (editForm) {
      editForm.addEventListener("submit", function () {
        document.getElementById("body").value = quill.root.innerHTML;
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
  }, 6000);
}

// Link buttons in hero section
document.addEventListener("DOMContentLoaded", () => {
  const heroBtn = document.querySelector(".hero-btn");
  const loginBtn = document.querySelector(".login-btn");
  const btnContainer = document.querySelector(".btn-container");

  // Hide login button if user is logged in and style hero button properly
  if (localStorage.getItem("userName")) {
    if (loginBtn) {
      loginBtn.style.display = "none";
      if (
        window.innerWidth > 768 &&
        window.innerWidth <= 1440 &&
        btnContainer
      ) {
        btnContainer.style.flexDirection = "row";
      }
    }
  }
  // Adjust styling if window is resized
  window.addEventListener("resize", () => {
    const btnContainer = document.querySelector(".btn-container");

    if (btnContainer) {
      if (window.innerWidth > 768 && window.innerWidth <= 1440) {
        btnContainer.style.flexDirection = "row";
      } else {
        btnContainer.style.flexDirection = "";
      }
    }
  });

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

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const currentPage = window.location.pathname;

  // Restrict access to edit/add pages for only logged in users
  if ((currentPage.includes("add") || currentPage.includes("edit")) && !token) {
    window.location.href = "../account/login.html";
  }

  // Restrict login and register pages for logged in users
  if (
    (currentPage.includes("login") || currentPage.includes("register")) &&
    token
  ) {
    window.location.href = "../post/feed.html";
  }
});

// Show notifications after action
document.addEventListener("DOMContentLoaded", () => {
  const message = localStorage.getItem("notificationMessage");
  const type = localStorage.getItem("notificationType");

  if (message) {
    showNotification(message, type);

    localStorage.removeItem("notificationMessage");
    localStorage.removeItem("notificationType");

    setTimeout(() => {
      document.querySelector(".notification")?.remove();
    }, 5000);
  }
});
