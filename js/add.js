import { apiKey } from "./api.js";
import { showNotification } from "./script.js";
import { quill } from "./script.js";

document.addEventListener("DOMContentLoaded", () => {
  const authorInput = document.getElementById("author");
  const dateInput = document.getElementById("created");
  const tagInput = document.getElementById("tags");
  const tagContainer = document.getElementById("tag-container");
  const tagsHiddenInput = document.getElementById("tags-hidden-input");
  const form = document.getElementById("add-form");
  const titleInput = document.getElementById("title");
  const mediaInput = document.getElementById("media");
  const createdInput = document.getElementById("created");
  const authToken = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");

  let tags = [];

  prepopulateFields();

  // Event listener for tags
  tagInput?.addEventListener("keydown", handleTagInput);

  // Form submission handler
  form?.addEventListener("submit", handleFormSubmit);

  // Function to prepopulate author and date fields
  function prepopulateFields() {
    if (userName && authorInput) {
      authorInput.value = userName.replace(/_/g, " ");
    }

    if (dateInput) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }
  }

  // Function to handle the tag input field
  function handleTagInput(event) {
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
  }

  // Function to create tag elements
  function createTagElement(tag) {
    const tagElement = document.createElement("span");
    tagElement.classList.add("tag-item");
    tagElement.textContent = tag;

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

  function updateTagsInput() {
    tagsHiddenInput.value = tags.join(",");
  }

  // Function to handle form submission
  async function handleFormSubmit(event) {
    event.preventDefault();
    let isValid = true;

    const bodyContent = quill.root.innerHTML;
    document.getElementById("body").value = bodyContent;
    const mediaUrl = mediaInput.value.trim();

    // Validate form fields
    isValid = await validateForm(mediaUrl, bodyContent);

    if (!isValid) {
      showNotification("Please fill out all required fields.", "error");
      return;
    }

    const blogPostData = createBlogPostData(bodyContent);

    if (await submitBlogPost(blogPostData)) {
      localStorage.setItem(
        "notificationMessage",
        "Blog post added successfully!"
      );
      localStorage.setItem("notificationType", "success");
      window.location.href = "feed.html";
    }
  }

  // Function to validate form fields
  async function validateForm(mediaUrl, bodyContent) {
    let isValid = true;

    // Validate media URL
    if (mediaUrl && !(await isValidImageUrl(mediaUrl))) {
      mediaInput.classList.add("error-forms");
      showNotification("Please provide a valid image URL.", "error");
      isValid = false;
    } else {
      mediaInput.classList.remove("error-forms");
    }

    // Validate required fields
    [titleInput, authorInput, createdInput, mediaInput].forEach((field) => {
      if (!field?.value.trim()) {
        field.classList.add("error-forms");
        isValid = false;
      } else {
        field.classList.remove("error-forms");
      }
    });

    // Validate Quill body
    if (!bodyContent.trim() || bodyContent === "<p><br></p>") {
      document.querySelector(".ql-container")?.classList.add("error-forms");
      isValid = false;
    } else {
      document.querySelector(".ql-container")?.classList.remove("error-forms");
    }

    return isValid;
  }

  // Function to return blog post data
  function createBlogPostData(bodyContent) {
    const tags =
      tagsHiddenInput && tagsHiddenInput.value.trim()
        ? tagsHiddenInput.value.split(",").map((tag) => tag.trim())
        : ["Technology"];

    return {
      title: titleInput.value.trim(),
      body: bodyContent,
      media: { url: mediaInput.value.trim(), alt: "Image description" },
      tags,
      author: userName,
    };
  }

  // Function to submit blog post data to API
  async function submitBlogPost(blogPostData) {
    try {
      const apiUrl = `https://v2.api.noroff.dev/blog/posts/${userName}`;
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
      if (!response.ok) {
        showNotification(result.message || "Failed to add post.", "error");
        return false;
      }
      return true;
    } catch (error) {
      showNotification("An error occurred. Please try again.", "error");
      console.error("Error:", error);
      return false;
    }
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

// Function to check if image URL is valid
export async function isValidImageUrl(url) {
  try {
    const response = await fetch(url);
    return (
      response.ok && response.headers.get("Content-Type").includes("image")
    );
  } catch {
    return false;
  }
}
