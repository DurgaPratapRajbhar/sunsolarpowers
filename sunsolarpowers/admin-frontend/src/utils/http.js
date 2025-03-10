import axios from "axios";
import { toast } from "react-toastify";

 

const HTTP = async (method, URL, data, token) => {
  // try {
  //   const isFileUpload = data instanceof FormData; // Check if data is FormData (image upload)

  //   const response = await axios({
  //     method,
  //     url: URL,
  //     data: method !== "GET" && method !== "DELETE" ? (isFileUpload ? data : JSON.stringify(data)) : undefined,
  //     headers: {
  //       "Content-Type": isFileUpload ? "multipart/form-data" : "application/json",
  //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //     },
  //     withCredentials: true,
  //   });

  //   return response.data;
  // } 
  
  try {
    let isFileUpload = data instanceof FormData; // Check if FormData (file upload)
    
    // Convert FormData to JSON if it's not a file upload
    if (!isFileUpload && data instanceof FormData) {
      data = convertFormDataToJson(data);
    }

    const response = await axios({
      method,
      url: URL,
      data: method !== "GET" && method !== "DELETE" ? (isFileUpload ? data : JSON.stringify(data)) : undefined,
      headers: {
        "Content-Type": isFileUpload ? "multipart/form-data" : "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: true,
    });

    return response.data;
  }
  
  catch (error) {

    if (axios.isAxiosError(error)) {
        const errorData = error.response?.data?.error;

        if (Array.isArray(errorData)) {
            errorData.forEach((data) => {
                toast.error(data.message);
            });
        } else if (typeof errorData === "object" && errorData !== null) {
        
            if (errorData.message) {
                toast.error(errorData.message);
            } else {
                toast.error("An unknown error occurred.");
            }
        } else if (typeof errorData === "string") {
          
            toast.error(errorData);
        } else { 
            toast.error(error.message || "An error occurred.");
        }
    } else {
        toast.error("An unexpected error occurred");
    }

    throw error;
}

};

  
export { HTTP };