const fetchApi = async (endpoint, method, data) => {
  try {
    let response;
    const url = `http://localhost:3000/api${endpoint}`;

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
