// Variables for pagination and sorting
const postsPerPage = 12;
let currentPage = 1;
let currentSort = "created";
let currentSortOrder = "desc";

// Fetch blog posts by author (with pagination and sorting)
async function fetchBlogPosts(
  page = 1,
  limit = 12,
  sort = "created",
  sortOrder = "desc"
) {
  const blogFeed = document.getElementById("blog-feed-container");
  const loggedInUser = localStorage.getItem("userName");
  const author = loggedInUser || "Maya_Thompson";
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
}

// Globally accessible
window.fetchBlogPosts = fetchBlogPosts;

// Render all blog posts in the feed from logged in user (or default Maya_Thompson)
function renderBlogPosts(posts) {
  const blogFeed = document.getElementById("blog-feed-container");
  const loggedInUser = localStorage.getItem("userName");

  if (!blogFeed) return;

  blogFeed.innerHTML = "";
  if (!posts.length) {
    blogFeed.innerHTML = `<p class="error-message margin-left">You have not made a post yet. Please add a new blog post.</p>`;
    return;
  }

  posts.forEach((post) => {
    const postAuthor = post.author.name;
    const isAuthor = loggedInUser && loggedInUser === postAuthor;
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
            <div class="author-edit">
              <p class="author">By ${
                post.author?.name.replace(/_/g, " ") || "Unknown Author"
              }</p>
              ${
                isAuthor
                  ? `<button class="edit" data-id="${post.id}"><i class="fa-solid fa-pen"></i> Edit</button>`
                  : ""
              }
            </div>
            <h3>${post.title}</h3>
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

    // Event listener for the edit button
    const editButton = postElement.querySelector(".edit");
    if (editButton) {
      editButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const postId = editButton.getAttribute("data-id");
        window.location.href = `edit.html?author=${postAuthor}&id=${postId}`;
      });
    }
  });
}

// Render pagination buttons
function renderPagination(meta, currentPage, limit) {
  const paginationContainer = document.getElementById("pagination-container");
  if (!paginationContainer) return;
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

// Format blog feed dates correctly
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// Dropdown for sorting
function sortDropdown() {
  const dropdownItems = document.querySelectorAll(
    ".dropdown-content input[type='radio']"
  );

  dropdownItems.forEach((item) => {
    item.addEventListener("change", (event) => {
      const value = event.target.value;
      const [sort, order] = value.split("-");

      currentSort = sort;
      currentSortOrder = order;

      // Fetch posts with the selected sorting options
      fetchBlogPosts(currentPage, postsPerPage, currentSort, currentSortOrder);
      closeDropdown();
    });
  });

  // Close the dropdown if clicking outside of it
  document.addEventListener("click", (event) => {
    const dropdown = document.querySelector(".custom-dropdown");
    if (dropdown && !dropdown.contains(event.target)) {
      closeDropdown();
    }
  });
}

// Function to hide the dropdown
function closeDropdown() {
  const dropdownContent = document.querySelector(".dropdown-content");
  const button = document.querySelector(".dropdown-btn");
  dropdownContent.classList.remove("show");
  button.classList.remove("active");
}

// Toggle dropdown visibility when clicking the button
const dropdownContent = document.querySelector(".dropdown-content");
const button = document.querySelector(".dropdown-btn");
if (button && dropdownContent) {
  button.addEventListener("click", (event) => {
    dropdownContent.classList.toggle("show");
    button.classList.toggle("active");
    event.stopPropagation();
  });
}

// Function to fetch the latest posts
async function fetchLatestPosts() {
  const author = localStorage.getItem("userName") || "Maya_Thompson";
  const limit = 3;

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${author}?limit=${limit}&sort=created&sortOrder=desc`
    );
    if (!response.ok) throw new Error("Failed to fetch latest posts");

    const data = await response.json();
    renderCarouselPosts(data.data);
  } catch (error) {
    console.error("Error fetching latest posts:", error);
  }
}

// Render latest posts in the carousel
function renderCarouselPosts(posts) {
  const loggedInUser = localStorage.getItem("userName");
  const latestPostsContainer = document.getElementById(
    "latest-posts-container"
  );
  if (latestPostsContainer) {
    latestPostsContainer.innerHTML = "";
  }

  const carouselWrapper = document.createElement("div");
  carouselWrapper.classList.add("carousel");

  const carouselContent = document.createElement("div");
  carouselContent.classList.add("carousel-content");

  posts.forEach((post) => {
    const postAuthor = post.author.name;
    const isAuthor = loggedInUser && loggedInUser === postAuthor;
    const postElement = document.createElement("div");
    postElement.classList.add("carousel-item");

    postElement.innerHTML = `
      <a href="post.html?author=${post.author?.name}&id=${post.id}">
        <img src="${post.media?.url}" alt="${post.media?.alt || "Post image"}">
        <div class="carousel-text">
          <div class="author-edit">
            <p class="author latest-author">By ${
              post.author?.name.replace(/_/g, " ") || "Unknown Author"
            }</p>
            ${
              isAuthor
                ? `<button class="edit latest-edit small" data-id="${post.id}"><i class="fa-solid fa-pen"></i> Edit</button>`
                : ""
            }
          </div>
          <h2>${post.title}</h2>
          <div id="tags-date">
            <p class="tags latest-tags">#${post.tags?.[0]}</p>
            <i class="fa-solid fa-circle" id="circle-feed"></i>
            <p class="date latest-date">${formatDate(post.created)}</p>
          </div>
          ${
            isAuthor
              ? `<button class="edit latest-edit-large" data-id="${post.id}"><i class="fa-solid fa-pen"></i> Edit</button>`
              : ""
          }
        </div>
      </a>
    `;
    carouselContent.appendChild(postElement);

    // Event listener for the edit button
    document.addEventListener("click", function (event) {
      const editButton = event.target.closest(".edit");
      if (editButton) {
        event.preventDefault();
        event.stopPropagation();

        const postId = editButton.getAttribute("data-id");
        const postAuthor = editButton
          .closest(".carousel-item")
          .querySelector(".author")
          .innerText.replace("By ", "");

        window.location.href = `edit.html?author=${postAuthor}&id=${postId}`;
      }
    });
  });

  if (carouselWrapper) {
    carouselWrapper.appendChild(carouselContent);
  }

  if (latestPostsContainer) {
    latestPostsContainer.appendChild(carouselWrapper);
  }

  addCarouselNavigation(carouselContent);
}

// Add navigation buttons to the carousel
function addCarouselNavigation(carouselContent) {
  const prevButton = document.createElement("button");
  prevButton.classList.add("carousel-button", "prev");
  prevButton.innerHTML = '<i class="fa-solid fa-circle-chevron-left"></i>';
  prevButton.addEventListener("click", () => scrollCarousel("prev"));

  const nextButton = document.createElement("button");
  nextButton.classList.add("carousel-button", "next");
  nextButton.innerHTML = '<i class="fa-solid fa-circle-chevron-right"></i>';
  nextButton.addEventListener("click", () => scrollCarousel("next"));

  carouselContent.appendChild(prevButton);
  carouselContent.appendChild(nextButton);

  initializeCarousel();
}

// Function t initialize carousel scrolling
function initializeCarousel() {
  setTimeout(() => scrollCarousel("next"), 100);
}

// Scrolling functionality for the carousel
let currentIndex = 0;
function scrollCarousel(direction) {
  const carouselContent = document.querySelector(".carousel-content");
  const items = document.querySelectorAll(".carousel-item");
  const totalItems = items.length;

  if (totalItems === 0) {
    if (carouselContent) {
      carouselContent.innerHTML = `<p class="error-message">There are no latest posts. Please add new blog posts.</p>`;
      return;
    }
  }

  const currentItem = items[currentIndex];

  if (currentItem) {
    if (direction === "next") {
      currentIndex = (currentIndex + 1) % totalItems;
    } else {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    }

    const nextItem = items[currentIndex];
    carouselContent.scrollTo({
      left: nextItem.offsetLeft,
      behavior: "smooth",
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  fetchLatestPosts();
  sortDropdown();

  await fetchBlogPosts(
    currentPage,
    postsPerPage,
    currentSort,
    currentSortOrder
  );
});
