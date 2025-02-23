import { apiKey } from "./api.js";
import { showNotification } from "./script.js";

// Register a new user in the API
export async function registerUser(username, email, password) {
  const apiUrl = "https://v2.api.noroff.dev/auth/register";
  const userData = { name: username, email, password };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
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
export async function loginUser(email, password) {
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
    return null;
  }
}

// Handle form submission for user registration or login
document.addEventListener("DOMContentLoaded", () => {
  // Handle registration form submission
  const registerForm = document.getElementById("register");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

      const nameError = document.getElementById("nameError");
      const emailError = document.getElementById("emailError");
      const passwordError = document.getElementById("passwordError");

      // Clear previous error messages
      nameError.textContent = "";
      emailError.textContent = "";
      passwordError.textContent = "";

      let isValid = true;

      // Validate first and last name
      let username = nameInput.value.trim();
      let nameParts = username.split(" ");
      if (nameParts.length < 2) {
        nameError.textContent = "First and last name are required.";
        nameInput.classList.add("error");
        isValid = false;
      } else {
        nameInput.classList.remove("error");
      }

      // Validate email format
      const email = emailInput.value.trim();
      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
      if (!email) {
        emailError.textContent = "Email is required.";
        emailInput.classList.add("error");
        isValid = false;
      } else if (!email.match(emailPattern)) {
        emailError.textContent = "Enter a valid email address.";
        emailInput.classList.add("error");
        isValid = false;
      } else {
        emailInput.classList.remove("error");
      }

      // Validate password
      const password = passwordInput.value.trim();
      if (!password) {
        passwordError.textContent = "Password is required.";
        passwordInput.classList.add("error");
        isValid = false;
      } else if (password.length < 8) {
        passwordError.textContent =
          "Password must be at least 8 characters long.";
        passwordInput.classList.add("error");
        isValid = false;
      } else {
        passwordInput.classList.remove("error");
      }

      if (!isValid) return;

      // Replace spaces in the full name with underscores
      username = username.replace(/\s+/g, "_");

      const response = await registerUser(username, email, password);

      if (response) {
        localStorage.setItem(
          "notificationMessage",
          "Your account has been created successfully! Please log in to continue."
        );
        localStorage.setItem("notificationType", "success");
        window.location.href = "login.html";
      }
    });
  }

  // Handle login form submission
  const loginForm = document.getElementById("login");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const emailInput = loginForm.querySelector("#email");
      const passwordInput = loginForm.querySelector("#password");

      const emailError = loginForm.querySelector("#emailError");
      const passwordError = loginForm.querySelector("#passwordError");

      emailError.textContent = "";
      passwordError.textContent = "";

      let isValid = true;

      // Validate email
      const email = emailInput.value.trim();
      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
      if (!email) {
        emailError.textContent = "Email is required.";
        emailInput.classList.add("error");
        isValid = false;
      } else if (!email.match(emailPattern)) {
        emailError.textContent = "Enter a valid email address.";
        emailInput.classList.add("error");
        isValid = false;
      } else {
        emailInput.classList.remove("error");
      }

      // Validate password
      const password = passwordInput.value.trim();
      if (!password) {
        passwordError.textContent = "Password is required.";
        passwordInput.classList.add("error");
        isValid = false;
      } else {
        passwordInput.classList.remove("error");
      }

      if (!isValid) return;

      const response = await loginUser(email, password, apiKey);

      if (response && response.data.accessToken) {
        // Store the access token and user info in localStorage
        localStorage.setItem("authToken", response.data.accessToken);
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userEmail", response.data.email);
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

  // Update navbar when logged in
  const loggedOutLinks = document.querySelectorAll(
    ".navbar-btns.logged-out, .nav-link.logged-out"
  );
  const loggedInLinks = document.querySelectorAll(
    ".navbar-btns.logged-in, .nav-link.logged-in"
  );

  const navbar = document.getElementById("navbar");
  const token = localStorage.getItem("authToken");

  if (token) {
    loggedInLinks.forEach((link) => (link.style.display = "flex"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));

    if (navbar) {
      navbar.style.maxWidth = "600px";
    }

    loggedInLinks.forEach((link) => {
      link.addEventListener("click", () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        window.location.href = "/index.html";
      });
    });
  } else {
    loggedOutLinks.forEach((link) => (link.style.display = "flex"));
    loggedInLinks.forEach((link) => (link.style.display = "none"));

    if (navbar) {
      navbar.style.maxWidth = "730px";
    }
  }
});
