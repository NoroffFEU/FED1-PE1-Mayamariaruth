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
