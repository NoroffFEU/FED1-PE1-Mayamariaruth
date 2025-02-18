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
        <input type="text" id="mobile-tag-input" placeholder="Enter tags and press enter">
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
