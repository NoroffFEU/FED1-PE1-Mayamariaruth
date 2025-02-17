import { apiKey } from "../config.js";
import { showNotification } from "./script.js";
import { quill } from "./script.js";

// Handle prepopulating form fields, creating Tags and form submission
document.addEventListener("DOMContentLoaded", () => {
  // Prepopulate author and date fields
  const authorInput = document.getElementById("author");
  const dateInput = document.getElementById("created");
  const userName = localStorage.getItem("userName");

  if (userName && authorInput) {
    // Replace underscores with spaces
    authorInput.value = userName.replace(/_/g, " ");
  }

  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  // Handle the "Tags" input and add them as buttons
  const tagInput = document.getElementById("tags");
  const tagContainer = document.getElementById("tagContainer");
  const tagsHiddenInput = document.getElementById("tagsHiddenInput");

  let tags = [];

  // Update the hidden input field
  function updateTagsInput() {
    tagsHiddenInput.value = tags.join(",");
  }

  // Create tag elements
  function createTagElement(tag) {
    const tagElement = document.createElement("span");
    tagElement.classList.add("tag-item");
    tagElement.textContent = tag;

    // Add X icon to remove tag
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("tag-remove");
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    removeBtn.addEventListener("click", () => {
      tags = tags.filter((t) => t !== tag);
      tagElement.remove();
      updateTagsInput();
    });

    tagElement.appendChild(removeBtn);
    tagContainer.appendChild(tagElement);
  }

  // Handle tag input on Enter key
  if (tagInput) {
    tagInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && tagInput.value.trim() !== "") {
        event.preventDefault();
        const newTag = tagInput.value.trim();

        if (!tags.includes(newTag)) {
          tags.push(newTag);
          createTagElement(newTag);
          updateTagsInput();
        }

        tagInput.value = "";
      }
    });
  }

  // Handle Add Blog Post form submission
  const form = document.getElementById("add-form");
  const titleInput = document.getElementById("title");
  const mediaInput = document.getElementById("media");
  const authToken = localStorage.getItem("authToken");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const bodyContent = quill.root.innerHTML;
      document.getElementById("body").value = bodyContent;

      // Generate a slug from the title for the API
      const postName = titleInput.value
        .trim()
        .split(" ")
        .slice(0, 5)
        .join("-")
        .toLowerCase();

      // Format tags correctly
      const tags = tagsHiddenInput?.value
        ? tagsHiddenInput.value.split(",").map((tag) => tag.trim())
        : [];

      const blogPostData = {
        title: titleInput.value.trim(),
        body: bodyContent,
        media: {
          url: mediaInput.value.trim(),
          alt: "Image description",
        },
        tags,
        author: userName,
      };

      if (
        !blogPostData.title ||
        !blogPostData.body ||
        !blogPostData.media.url
      ) {
        showNotification("Please fill in all required fields.", "error");
        return;
      }

      try {
        const apiUrl = `https://v2.api.noroff.dev/blog/posts/${postName}`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${authToken}`,
            "X-Noroff-API-Key": apiKey,
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
  }

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
