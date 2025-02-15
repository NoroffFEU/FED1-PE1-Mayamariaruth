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

// Handle form submission for user registration
document.addEventListener("DOMContentLoaded", () => {
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
        window.location.href = "login.html";
        showNotification(
          "Your account has been created successfully! Please log in to continue.",
          "success"
        );
      }
    });
  }
});

// Authenticates login
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
    localStorage.setItem("authToken", data.accessToken);
    window.location.href = "index.html";
    showNotification("Login successful! Welcome back.", "success");
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    showNotification(error.message, "error");
  }
}
