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

// Render sorted blog posts in the feed
function renderBlogPosts(posts) {
  const blogFeed = document.getElementById("blog-feed-container");
  blogFeed.innerHTML = "";
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("blog-post");
    postElement.innerHTML = `
            <div class="blog-card">
                <img src="${post.image}" alt="${post.title}">
                <div class="blog-content">
                    <p class="author">By ${post.author}</p>
                    <h2>${post.title}</h2>
                    <p class="tags">#${post.tags.join(" #")}</p>
                    <i class="fa-solid fa-circle"></i>
                    <p class="date">${post.date}</p>
                </div>
            </div>
        `;
    blogFeed.appendChild(postElement);
  });
}
