// API key
let apiKey;
if (window.location.hostname === "localhost") {
  // For local development
  import("../config.js").then((module) => {
    apiKey = module.apiKey;
  });
} else {
  // For production (Netlify)
  apiKey = window.env && window.env.VITE_API_KEY;
}

export { apiKey };

// Fetch blog posts from API
export async function fetchPosts() {
  const apiUrl = "https://v2.api.noroff.dev/blog/posts";

  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "X-Noroff-API-Key": apiKey,
    },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: Unable to fetch blog posts`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    alert(error.message);
  }
}
