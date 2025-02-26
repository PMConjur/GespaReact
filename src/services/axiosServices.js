import axios from "axios";

const servicio = axios.create({
  baseURL: "http://192.168.7.33/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor to add the token to the headers
servicio.interceptors.request.use(
  (config) => {
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const token = responseData?.ejecutivo?.token;
    console.log("Token en interceptor:", token); // Log the token to ensure it is set
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

servicio.interceptors.response.use(null, (error) => {
  return Promise.reject(error);
});

export default servicio;
