import axios from 'axios';

const api = axios.create({ baseURL: 'http://10.0.2.2:8080' });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios Error:', error.message);
    console.error('Error Details:', error.response);
    return Promise.reject(error);
  }
);

export default api;