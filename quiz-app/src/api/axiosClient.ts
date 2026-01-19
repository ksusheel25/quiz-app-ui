import axios from "axios";

const baseURL = "http://localhost:8080";

const axiosClient = axios.create({ baseURL });

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
