// Hide the "Add Post" link for not logged in users
document.addEventListener("DOMContentLoaded", () => {
  const addPostLink = document.querySelector(".add-post-link");
  const authToken = localStorage.getItem("authToken");

  if (!authToken && addPostLink) {
    addPostLink.style.display = "none";
  }
});
