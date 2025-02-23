// Display blog post content based on ID
document.addEventListener("DOMContentLoaded", fetchBlogPostDetails);

async function fetchBlogPostDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const author = urlParams.get("author");
  const postId = urlParams.get("id");

  if (!author || !postId) {
    showError("Post not found.");
    return;
  }

  try {
    const formattedAuthor = author.replace(/ /g, "_");
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${formattedAuthor}/${postId}`
    );
    if (!response.ok) throw new Error("Failed to fetch post.");

    const post = await response.json();
    const loggedInUser = localStorage.getItem("userName");
    const isAuthor = loggedInUser === post.data.author.name;

    // Render the edit button if the user is the author
    if (isAuthor) {
      const editContainer = document.getElementById("edit-container");
      if (editContainer) {
        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = '<i class="fa-solid fa-pen"></i> Edit';
        editButton.addEventListener("click", () => {
          window.location.href = `edit.html?author=${author}&id=${postId}`;
        });
        editContainer.appendChild(editButton);
      }
    }

    const postDateElement = document.getElementById("post-date");
    if (postDateElement) {
      postDateElement.textContent = formatDate(post.data.created);
    }

    const postTitleElement = document.getElementById("post-title");
    if (postTitleElement) {
      postTitleElement.textContent = post.data.title;
    }

    const postImageElement = document.getElementById("post-image");
    if (postImageElement) {
      postImageElement.src = post.data.media?.url || "";
      postImageElement.alt = post.data.media?.alt || "Blog image";
    }

    const postAuthorElement = document.getElementById("post-author");
    if (postAuthorElement) {
      postAuthorElement.textContent = `By ${post.data.author.name.replace(
        /_/g,
        " "
      )}`;
    }

    const postBodyElement = document.getElementById("post-body");
    if (postBodyElement) {
      postBodyElement.innerHTML = post.data.body;
    }
    // Generate tag buttons
    const tagElement = document.getElementById("post-tag");
    const allTagsContainer = document.getElementById("post-all-tags");

    if (
      tagElement &&
      allTagsContainer &&
      post.data.tags &&
      post.data.tags.length > 0
    ) {
      // Set the first tag as the main post tag
      tagElement.textContent = `#${post.data.tags[0]}`;

      allTagsContainer.innerHTML = "";

      post.data.tags.forEach((tag) => {
        const tagButton = document.createElement("button");
        tagButton.classList.add("tags-blog-post");
        tagButton.textContent = `#${tag}`;
        allTagsContainer.appendChild(tagButton);
      });
    } else {
      if (allTagsContainer) {
        allTagsContainer.innerHTML = "";
      }
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    showError("Failed to load post.");
  }
}

// Function to format the date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Function to show the form field error messages
function showError(message) {
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.innerHTML = `<p class='error-message'>${message}</p>`;
  }
}
