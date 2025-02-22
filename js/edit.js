import { apiKey } from "../config.js";
import { quill } from "./script.js";
import { showNotification } from "./script.js";

let postId;

document.addEventListener("DOMContentLoaded", fetchPostData);

// Fetch blog post details for form fields
async function fetchPostData() {
  if (!window.location.pathname.includes("edit.html")) return;

  const urlParams = new URLSearchParams(window.location.search);
  postId = urlParams.get("id");
  const author = urlParams.get("author");
  const editForm = document.getElementById("edit-form");

  if (!postId || !author) {
    if (editForm) {
      editForm.innerHTML =
        '<p class="error-message">Failed to load post. Please try again later.</p>';
      return;
    }
  }

  try {
    const formattedAuthor = author.replace(/ /g, "_");
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${formattedAuthor}/${postId}`
    );
    if (!response.ok) throw new Error("Failed to fetch post.");

    const post = await response.json();
    const data = post.data;

    // Populate form fields
    document.getElementById("title").value = data.title || "";
    document.getElementById("author").value =
      data.author.name.replace(/_/g, " ") || "";
    document.getElementById("created").value = data.created
      ? formatDateForInput(data.created)
      : "";
    document.getElementById("media").value = data.media?.url || "";
    quill.root.innerHTML = data.body || "";

    // Handle existing tags
    const tagContainer = document.getElementById("tag-container");
    const tagsHiddenInput = document.getElementById("tags-hidden-input");
    let tags = data.tags || [];

    // Function to update hidden input
    function updateTagsInput() {
      tagsHiddenInput.value = tags.join(",");
    }

    // Function to create and display tag buttons
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

    tags.forEach(createTagElement);

    // Handle tag input on Enter key
    const tagInput = document.getElementById("tags");
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
  } catch (error) {
    console.error("Error fetching post:", error);
    if (editForm) {
      editForm.innerHTML =
        '<p class="error-message">Failed to load post. Please try again later.</p>';
    }
  }
}

// Event listener for form submission
const editForm = document.getElementById("edit-form");
if (editForm) {
  editForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const created = document.getElementById("created").value;
    const media = document.getElementById("media").value;
    const body = quill.root.innerHTML;
    const tagsHiddenInput = document.getElementById("tags-hidden-input");
    const tagContainer = document.getElementById("tag-container");

    // Validate form fields
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const createdInput = document.getElementById("created");
    const mediaInput = document.getElementById("media");
    const quillContainer = document.querySelector(".ql-container");
    let isValid = true;

    [titleInput, authorInput, createdInput, mediaInput].forEach((field) => {
      // Remove error-forms class when typing
      field.addEventListener("input", () => {
        if (field.value.trim()) {
          field.classList.remove("error-forms");
        }
      });

      // Validate on submit
      if (!field || !field.value.trim()) {
        field.classList.add("error-forms");
        isValid = false;
      } else {
        field.classList.remove("error-forms");
      }
    });

    // Validate Quill body (which already automatically contains tags when empty)
    const quillContent = quill.root.innerHTML.trim();
    if (quillContent === "<p><br></p>" || !quillContent) {
      quillContainer.classList.add("error-forms");
      isValid = false;
    } else {
      quillContainer.classList.remove("error-forms");
    }

    if (!isValid) {
      showNotification("Please fill out all required fields.", "error");
      return;
    }

    // Merge old tags with new tags
    const existingTags = tagsHiddenInput.value
      ? tagsHiddenInput.value.split(",").map((tag) => tag.trim())
      : [];

    const visibleTags = Array.from(
      tagContainer.querySelectorAll(".tag-item")
    ).map((tagEl) => tagEl.textContent.trim());

    const tags = [...new Set([...existingTags, ...visibleTags])];
    tagsHiddenInput.value = tags.join(",");

    const token = localStorage.getItem("authToken");
    const userName = localStorage.getItem("userName");

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/blog/posts/${userName}/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            author: userName,
            created,
            media: { url: media },
            body,
            tags,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update post.");

      localStorage.setItem("notificationMessage", "Post updated successfully!");
      localStorage.setItem("notificationType", "success");

      window.location.href = `/templates/post/post.html?author=${author}&id=${postId}`;
    } catch (error) {
      console.error("Error updating post:", error);

      localStorage.setItem(
        "notificationMessage",
        "Failed to update post. Please try again later."
      );
      localStorage.setItem("notificationType", "error");

      showNotification(
        "Failed to update post. Please try again later.",
        "error"
      );
    }

    const currentPage = window.location.pathname;

    if (currentPage.endsWith("post.html")) {
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
}

// Format the date correctly for the input
function formatDateForInput(dateString) {
  return new Date(dateString).toISOString().split("T")[0];
}

// Delete blog post functionality (with modal)
document.addEventListener("DOMContentLoaded", () => {
  const deleteButton = document.querySelector(".delete-btn");
  const modal = document.getElementById("delete-modal");
  const confirmDelete = document.getElementById("confirm-delete");
  const cancelDelete = document.getElementById("cancel-delete");
  const postId = new URLSearchParams(window.location.search).get("id");
  const userName = localStorage.getItem("userName");
  const authToken = localStorage.getItem("authToken");

  if (deleteButton && postId && userName) {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      modal.style.display = "flex";
    });

    // Confirm delete action
    confirmDelete.addEventListener("click", async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/blog/posts/${userName}/${postId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );

        if (response.ok) {
          localStorage.setItem(
            "notificationMessage",
            "Post deleted successfully!"
          );
          localStorage.setItem("notificationType", "success");
          window.location.href = "/templates/post/feed.html";
        } else {
          showNotification("Failed to delete post. Try again later.", "error");
        }
      } catch (error) {
        showNotification("An error occurred. Please try again.", "error");
        console.error("Error deleting post:", error);
      } finally {
        modal.style.display = "none";
      }
    });

    cancelDelete.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
});
