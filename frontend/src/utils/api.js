import axios from "axios";

const api = axios.create({
  baseURL: "https://matsc-backend.onrender.com"
});

export default api;