// Variables for pagination and sorting
const postsPerPage = 12;
let currentPage = 1;
let currentSort = "created";
let currentSortOrder = "desc";

// Format blog feed dates correctly
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// Listen for changes in the sort dropdown
document.getElementById("sort-dropdown").addEventListener("change", (event) => {
  const [sort, order] = event.target.value.split("-");
  currentSort = sort;
  currentSortOrder = order;
  fetchBlogPosts(currentPage, postsPerPage, currentSort, currentSortOrder);
});

// Fetch blog posts by author (with pagination and sorting)
window.fetchBlogPosts = async function (
  page = 1,
  limit = 12,
  sort = "created",
  sortOrder = "desc"
) {
  const blogFeed = document.getElementById("blog-feed-container");
  const loggedInUser = localStorage.getItem("userName");
  const author = loggedInUser ? loggedInUser : "Maya_Thompson";
  const addPostLink = document.querySelector(".add-post-link");
  const authToken = localStorage.getItem("authToken");

  if (!authToken && addPostLink) {
    addPostLink.style.display = "none";
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${author}?limit=${limit}&page=${page}&sort=${sort}&sortOrder=${sortOrder}`
    );
    if (!response.ok) throw new Error("Failed to fetch posts");

    const data = await response.json();
    const posts = data.data || data;

    renderBlogPosts(posts);
    renderPagination(data.meta, page, limit);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    blogFeed.innerHTML = `<p class="error-message">Failed to load posts. Please try again later.</p>`;
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await fetchBlogPosts(currentPage, postsPerPage);
});

// Render pagination buttons
function renderPagination(meta, currentPage, limit) {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(meta.totalCount / limit);
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  if (prevPage) {
    paginationContainer.innerHTML += `<button class="pag-btn" onclick="fetchBlogPosts(${prevPage}, ${limit})">Prev</button>`;
  }

  paginationContainer.innerHTML += `<span id="page-count">Page ${currentPage} of ${totalPages}</span>`;

  if (nextPage) {
    paginationContainer.innerHTML += `<button class="pag-btn" onclick="fetchBlogPosts(${nextPage}, ${limit})">Next</button>`;
  }
}

function renderBlogPosts(posts) {
  const blogFeed = document.getElementById("blog-feed-container");
  blogFeed.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("blog-post");
    postElement.innerHTML = `
      <a href="post.html?author=${post.author?.name}&id=${
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
                  <p class="tags">#${post.tags?.[0]}</p>
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
