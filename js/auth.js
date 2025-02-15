import { apiKey } from "../config.js";
import { showNotification } from "./script.js";

// Register a new user in the API
export async function registerUser(username, email, password, accessToken) {
  const apiUrl = "https://v2.api.noroff.dev/auth/register";
  const userData = { name: username, email, password };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: Registration failed`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    showNotification(error.message, "error");
  }
}

// Authenticates login with API
export async function loginUser(email, password, apiKey) {
  const apiUrl = "https://v2.api.noroff.dev/auth/login";
  const credentials = { email, password };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error(`Error ${response.status}: Login failed`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    showNotification(error.message, "error");
    return null;
  }
}

// Handle form submission for user registration or login
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname;

  // Handle registration form submission
  const registerForm = document.getElementById("register");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      let username = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // Replace spaces in the full name with underscores
      username = username.replace(/\s+/g, "_");

      if (!username || !email || !password) {
        showNotification(
          "Please fill in all required fields correctly before proceeding.",
          "error"
        );
        return;
      }

      const response = await registerUser(username, email, password);

      if (response) {
        localStorage.setItem(
          "notification",
          "Your account has been created successfully! Please log in to continue."
        );
        window.location.href = "login.html";
      }
    });
  }

  // Handle login form submission
  const loginForm = document.getElementById("login");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        showNotification(
          "Please fill in all required fields correctly before proceeding.",
          "error"
        );
        return;
      }

      const response = await loginUser(email, password, apiKey);

      if (response && response.data && response.data.accessToken) {
        // Store the access token in localStorage
        localStorage.setItem("authToken", response.data.accessToken);
        localStorage.setItem(
          "notificationMessage",
          "Login successful! Welcome back."
        );
        localStorage.setItem("notificationType", "success");
        window.location.href = "../post/feed.html";
      } else {
        showNotification(
          "Login failed. Please check your credentials.",
          "error"
        );
      }
    });
  }

  // Show notification after login or registration
  if (currentPage.endsWith("login.html") || currentPage.endsWith("feed.html")) {
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
  }

  // Update navbar when logged in
  const loggedOutLinks = document.querySelectorAll(
    ".navbar-btns.logged-out, .nav-link.logged-out"
  );
  const loggedInLinks = document.querySelectorAll(
    ".navbar-btns.logged-in, .nav-link.logged-in"
  );
  const token = localStorage.getItem("authToken");

  if (token) {
    loggedInLinks.forEach((link) => (link.style.display = "flex"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));

    loggedInLinks.forEach((link) => {
      link.addEventListener("click", () => {
        localStorage.removeItem("authToken");
        window.location.href = "/index.html";
      });
    });
  } else {
    loggedOutLinks.forEach((link) => (link.style.display = "flex"));
    loggedInLinks.forEach((link) => (link.style.display = "none"));
  }
});
