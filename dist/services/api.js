import axios from "axios";

const baseURL = "http://localhost:3001";

const axiosParams = {
  baseURL,
};

const axiosInstance = axios.create(axiosParams);

const api = (http) => ({
  get: (url) => http.get(url),
  post: (url, body, config) => http.post(url, body, config),
  delete: (url, config) => http.delete(url, config),
});

export default api(axiosInstance);
