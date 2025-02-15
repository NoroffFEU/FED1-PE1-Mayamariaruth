// Fetch blog posts from API
export async function fetchPosts() {
  const apiUrl = "https://v2.api.noroff.dev/blog/posts";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: Unable to fetch blog posts`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    alert(error.message);
  }
}
