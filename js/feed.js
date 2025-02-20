// Hide the "Add Post" link for not logged in users and handle sorting functionality
document.addEventListener("DOMContentLoaded", () => {
  const addPostLink = document.querySelector(".add-post-link");
  const authToken = localStorage.getItem("authToken");

  if (!authToken && addPostLink) {
    addPostLink.style.display = "none";
  }

  // Sorting functionality
  const sortBtn = document.getElementById("sort-btn");
  const sortOverlay = document.getElementById("sort-overlay");

  // Sorting options
  const sortingOptions = [
    { label: "Name A-Z", value: "name", order: "asc" },
    { label: "Name Z-A", value: "name", order: "desc" },
    { label: "Trending", value: "trending", order: "desc" },
    { label: "Date (Newest)", value: "date", order: "desc" },
    { label: "Date (Oldest)", value: "date", order: "asc" },
  ];

  // Create sorting overlay
  function generateSortOverlay() {
    if (!sortOverlay.innerHTML) {
      sortOverlay.innerHTML = `
      <div class="overlay-content">
        <form id="sort-form">
          ${sortingOptions
            .map(
              (option) => `
            <label>
            ${option.label}
              <input type="radio" name="sort" value="${option.value}" data-order="${option.order}">
            </label>
          `
            )
            .join("")}
          <div class="overlay-buttons">
            <hr />
            <button type="button" id="close-sort">Close</button>
            <button type="submit" id="apply-sort">Apply</button>
          </div>
        </form>
      </div>
    `;

      document.getElementById("close-sort").addEventListener("click", () => {
        sortOverlay.classList.add("hidden");
      });

      document
        .getElementById("sort-form")
        .addEventListener("submit", (event) => {
          event.preventDefault();
          applySorting();
        });
    }
    sortOverlay.classList.toggle("hidden");
  }

  // Function to apply sorting
  async function applySorting() {
    const selectedOption = document.querySelector('input[name="sort"]:checked');
    if (selectedOption) {
      const sortValue = selectedOption.value;
      const sortOrder = selectedOption.dataset.order;

      await fetchSortedPosts(sortValue, sortOrder);

      sortOverlay.classList.add("hidden");
    }
  }

  if (sortBtn) {
    sortBtn.addEventListener("click", generateSortOverlay);
  }
});

// Fetch and update blog feed based on sorting
async function fetchSortedPosts(sort, order) {
  try {
    const response = await fetch(`/blog/posts?sort=${sort}&sortOrder=${order}`);
    if (!response.ok) throw new Error("Failed to fetch sorted posts");

    const posts = await response.json();

    updateBlogFeed(posts);
  } catch (error) {
    console.error("Error fetching sorted posts:", error);
  }
}

// Format blog feed dates correctly
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname.includes("feed.html")) {
    const blogFeed = document.getElementById("blog-feed-container");

    const loggedInUser = localStorage.getItem("userName");
    const author = loggedInUser ? loggedInUser : "Maya_Thompson";

    async function fetchBlogPosts() {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/blog/posts/${author}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        const posts = data.data || data;

        renderBlogPosts(posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        blogFeed.innerHTML = `<p class="error-message">Failed to load posts. Please try again later.</p>`;
      }
    }

    fetchBlogPosts();
  }
});

// Render all blog post in the feed
function renderBlogPosts(posts) {
  const blogFeed = document.getElementById("blog-feed-container");
  blogFeed.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("blog-post");
    postElement.innerHTML = `
      <a href="post.html?author=${post.author.name}&id=${
      post.id
    }" class="blog-link">
        <div class="blog-card">
            <img id="feed-img" src="${post.media?.url}" alt="${
      post.media?.alt || "Blog image"
    }">
            <div class="blog-content">
                <p class="author">By ${
                  post.author?.name.replace(/_/g, " ") || "Unknown Author"
                }</p>
                <h2>${post.title}</h2>
                <div id="tags-date">
                  <p class="tags">#${post.tags?.join(" #") || ""}</p>
                  <i class="fa-solid fa-circle" id="circle-feed"></i>
                  <p class="date">${formatDate(post.created)}</p>
                </div>
            </div>
        </div>
      </a>
    `;
    blogFeed.appendChild(postElement);
  });
}
