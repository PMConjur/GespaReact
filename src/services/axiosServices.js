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
    const token = config.headers.Authorization; // Use the token set in Login.jsx
    if (token) {
      config.headers.Authorization = token;
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
