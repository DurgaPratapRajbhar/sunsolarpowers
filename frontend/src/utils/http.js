import axios from "axios";
 const HTTP = async (method, URL, data, token) => {
  try {
    const response = await axios({
      method,
      url: URL,
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
}

};

 
export { HTTP };