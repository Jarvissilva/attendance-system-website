const fetchApi = async (endpoint, method, data) => {
  try {
    let response;
    const url = `https://attendance-system-jarvis-silva.vercel.app/api${endpoint}`;

    if (method === "POST") {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } else response = await fetch(url, { credentials: "include" });

    return response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export default fetchApi;
