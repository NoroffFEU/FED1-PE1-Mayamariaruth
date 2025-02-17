document.addEventListener("DOMContentLoaded", () => {
  // Prepopulate author and date fields
  const authorInput = document.getElementById("author");
  const dateInput = document.getElementById("created");
  const userName = localStorage.getItem("userName");

  if (userName) {
    // Replaces all underscores with spaces
    const authorName = userName.replace(/_/g, " ");
    authorInput.value = authorName;
  }

  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
});
