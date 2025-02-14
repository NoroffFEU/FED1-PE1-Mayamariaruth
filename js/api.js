// Fetch product data from API
export async function fetchProducts() {
  const apiUrl = "https://docs.noroff.dev/docs/v2/blog/posts";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error(
          "Server error: Unable to retrieve products. Please try again later."
        );
      } else if (response.status === 404) {
        throw new Error(
          "Products not found. The requested resource is missing."
        );
      } else {
        throw new Error(
          "Unexpected error: Failed to fetch products. Please try again."
        );
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    alert(error.message);
  }
}
