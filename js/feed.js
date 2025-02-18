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
    sortOverlay.innerHTML = `
        <div class="overlay-content">
          <h3>Sort By</h3>
          <form id="sort-form">
            ${sortingOptions
              .map(
                (option) => `
              <label>
                <input type="radio" name="sort" value="${option.value}" data-order="${option.order}">
                ${option.label}
              </label>
            `
              )
              .join("")}
            <div class="overlay-buttons">
              <button type="button" id="close-sort">Close</button>
              <button type="submit">Apply</button>
            </div>
          </form>
        </div>
      `;

    sortOverlay.classList.remove("hidden");

    document.getElementById("close-sort").addEventListener("click", () => {
      sortOverlay.classList.add("hidden");
    });

    document.getElementById("sort-form").addEventListener("submit", (event) => {
      event.preventDefault();
      applySorting();
    });
  }

  // Function to apply sorting
  function applySorting() {
    const selectedOption = document.querySelector('input[name="sort"]:checked');
    if (selectedOption) {
      const sortValue = selectedOption.value;
      const sortOrder = selectedOption.dataset.order;

      updateBlogFeed(sortValue, sortOrder);

      sortOverlay.classList.add("hidden");
    }
  }

  if (sortBtn) {
    sortBtn.addEventListener("click", generateSortOverlay);
  }
});

function updateBlogFeed(sort, order) {}
