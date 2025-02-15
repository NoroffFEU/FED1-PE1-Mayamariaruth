// Register a new user in the API
export async function registerUser(username, email, password) {
  const apiUrl = "https://v2.api.noroff.dev/auth/register";

  const userData = { name: username, email, password };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

      const username = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

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
