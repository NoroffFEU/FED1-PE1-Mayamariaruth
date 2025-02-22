// Fetch blog post details for form fields
async function fetchPostData() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const author = urlParams.get("author");

  if (!postId || !author) {
    showError("Post not found.");
    return;
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/${author}/${postId}`
    );
    if (!response.ok) throw new Error("Failed to fetch post.");

    const post = await response.json();
    const data = post.data;
    console.log(data);

    // Populate form fields
    document.getElementById("title").value = data.title || "";
    document.getElementById("author").value = data.author.name || "";
    document.getElementById("created").value = formatDateForInput(data.created);
    document.getElementById("media").value = data.media?.url || "";

    // Populate Quill editor
    const quill = new Quill("#editor", {
      theme: "snow",
    });
    quill.root.innerHTML = data.body || "";

    // Populate tags
    document.getElementById("tags").value = data.tags?.join(", ") || "";
    document.getElementById("tagsHiddenInput").value =
      data.tags?.join(", ") || "";
  } catch (error) {
    console.error("Error fetching post:", error);
    showError("Failed to load post.");
  }
}
