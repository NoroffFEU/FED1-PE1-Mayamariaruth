// Handle prepopulating form fields and form submission
document.addEventListener("DOMContentLoaded", () => {
  // Prepopulate author and date fields
  const authorInput = document.getElementById("author");
  const dateInput = document.getElementById("created");
  const userName = localStorage.getItem("userName");

  if (userName) {
    // Replace underscores with spaces to match API data
    authorInput.value = userName.replace(/_/g, " ");
  }

  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;

  // Handle form submission
  const form = document.getElementById("add-form");
  const titleInput = document.getElementById("title");
  const bodyInput = document.getElementById("body");
  const mediaInput = document.getElementById("media");
  const tagsHiddenInput = document.getElementById("tagsHiddenInput");
  const apiUrl = "https://v2.api.noroff.dev/blog/posts";
  const authToken = localStorage.getItem("authToken");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Format tags correctly
    const tags = tagsHiddenInput.value
      ? tagsHiddenInput.value.split(",").map((tag) => tag.trim())
      : [];

    const blogPostData = {
      title: titleInput.value.trim(),
      body: bodyInput.value.trim(),
      media: mediaInput.value.trim(),
      tags: tags,
      author: authorInput.value.trim(),
    };

    if (!blogPostData.title || !blogPostData.body || !blogPostData.media) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(blogPostData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "notificationMessage",
          "Blog post added successfully!"
        );
        localStorage.setItem("notificationType", "success");
        window.location.href = "feed.html";
      } else {
        showNotification(result.message || "Failed to add post.", "error");
      }
    } catch (error) {
      showNotification("An error occurred. Please try again.", "error");
      console.error("Error:", error);
    }
  });

  // Show success message on feed.html
  if (window.location.pathname.endsWith("feed.html")) {
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
});
