// Hide the "Add Post" link for not logged in users
document.addEventListener("DOMContentLoaded", () => {
  const addPostLink = document.querySelector(".add-post-link");
  const authToken = localStorage.getItem("authToken");

  if (!authToken && addPostLink) {
    addPostLink.style.display = "none";
  }
});

// Display mobile filter overlay
function createMobileFilterOverlay() {
  const overlay = document.getElementById("filter-overlay");
  overlay.innerHTML = `
      <div class="overlay-content">
        <h3>Sort By</h3>
        <label><input type="radio" name="sort" value="namea-z"> Name A-Z</label>
        <label><input type="radio" name="sort" value="namez-a"> Name Z-A</label>
        <label><input type="radio" name="sort" value="trending"> Trending</label>
        <label><input type="radio" name="sort" value="newest"> Date (Newest)</label>
        <label><input type="radio" name="sort" value="oldest"> Date (Oldest)</label>
  
        <h3>Filter By</h3>
        <hr>
        <strong>Author</strong>
        <div id="mobile-author-list"></div>
  
        <strong>Tags</strong>
        <input type="text" id="mobile-tag-input" placeholder="Enter one tag and press enter">
        <div id="mobile-selected-tags"></div>
  
        <button class="apply">Apply</button>
        <button class="close-overlay">Close</button>
      </div>`;

  overlay.classList.remove("hidden");

  populateMobileAuthors();
  setupMobileTagInput();

  document.querySelector(".close-overlay").addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  document.querySelector(".apply").addEventListener("click", applyFilters);
}

// Fetch authors dynamically for mobile overlay
async function populateMobileAuthors() {
  const authorList = document.getElementById("mobile-author-list");
  authorList.innerHTML = "";

  const response = await fetch("https://v2.api.noroff.dev/blog/posts");
  const posts = await response.json();
  const authors = [...new Set(posts.map((post) => post.author))];

  authors.forEach((author) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="author" value="${author}"> ${author}`;
    authorList.appendChild(label);
  });
}

// Handle tag input for mobile
function setupTagInput() {
  const tagInput = document.getElementById("tag-input");
  const tagContainer = document.getElementById("tag-container");

  tagInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && tagInput.value.trim() !== "") {
      event.preventDefault();

      // Ensure only one tag can be added
      if (tagContainer.childElementCount === 0) {
        const tag = tagInput.value.trim();

        const tagElement = document.createElement("div");
        tagElement.classList.add("tag");
        tagElement.innerHTML = `${tag} <button class="remove-tag">X</button>`;

        // Append tag and disable input
        tagContainer.appendChild(tagElement);
        tagInput.value = "";
        tagInput.disabled = true;

        tagElement
          .querySelector(".remove-tag")
          .addEventListener("click", () => {
            tagElement.remove();
            tagInput.disabled = false;
          });
      }
    }
  });
}

function createDesktopOverlay() {}

function updateBlogFeed(filters) {}
