import { quill } from "./script.js";

document.addEventListener("DOMContentLoaded", fetchPostData);

// Fetch blog post details for form fields
async function fetchPostData() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const author = urlParams.get("author");
  const editForm = document.getElementById("edit-form");

  if (!postId || !author) {
    editForm.innerHTML = `<p class="error-message">Failed to load post. Please try again later.</p>`;
    return;
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${author}/${postId}`
    );
    if (!response.ok) throw new Error("Failed to fetch post.");

    const post = await response.json();
    const data = post.data;

    // Populate form fields
    document.getElementById("title").value = data.title || "";
    document.getElementById("author").value =
      data.author.name.replace(/_/g, " ") || "";
    document.getElementById("created").value = formatDateForInput(data.created);
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
    editForm.innerHTML = `<p class="error-message">Failed to load post. Please try again later.</p>`;
  }
}

// Format the date correctly for the input
function formatDateForInput(dateString) {
  return new Date(dateString).toISOString().split("T")[0];
}
