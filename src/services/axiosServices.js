import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const servicio = axios.create({
  baseURL: {apiUrl},
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
