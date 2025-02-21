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
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${author}/${postId}`
    );
    if (!response.ok) throw new Error("Failed to fetch post.");

    const post = await response.json();

    document.getElementById("post-date").textContent = formatDate(
      post.data.created
    );
    document.getElementById("post-title").textContent = post.data.title;
    document.getElementById("post-image").src = post.data.media?.url || "";
    document.getElementById("post-image").alt =
      post.data.media?.alt || "Blog image";
    document.getElementById(
      "post-author"
    ).textContent = `By ${post.data.author.name.replace(/_/g, " ")}`;
    document.getElementById("post-body").innerHTML = post.data.body;

    // Generate tag buttons
    const tagElement = document.getElementById("post-tag");
    const allTagsContainer = document.getElementById("post-all-tags");

    if (post.data.tags && post.data.tags.length > 0) {
      // Set the first tag as the main post tag
      tagElement.textContent = `#${post.data.tags[0]}`;

      // Remove the first tag from the array and create buttons for the remaining tags
      const remainingTags = post.data.tags.slice(1);
      allTagsContainer.innerHTML = "";

      remainingTags.forEach((tag) => {
        const tagButton = document.createElement("button");
        tagButton.classList.add("tags-blog-post");
        tagButton.textContent = `#${tag}`;
        tagButton.addEventListener("click", () => {
          window.location.href = `feed.html?tag=${encodeURIComponent(tag)}`;
        });

        allTagsContainer.appendChild(tagButton);
      });
    } else {
      allTagsContainer.innerHTML = "";
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    showError("Failed to load post.");
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function showError(message) {
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.innerHTML = `<p class='error-message'>${message}</p>`;
  }
}
