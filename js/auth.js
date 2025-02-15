// Register new users
export async function registerUser(username, email, password) {
  const apiUrl = "https://v2.api.noroff.dev/auth/register";

  const userData = {
    name: username,
    email,
    password,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok)
      throw new Error(`Error ${response.status}: Registration failed`);

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    alert(error.message);
  }
}
