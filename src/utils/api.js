import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://swiggy-clone-x5a7.onrender.com/api' : 'http://localhost:5000/api'),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token to requests if present in localStorage
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('swiggy_user');

    if (user) {
      const parsedUser = JSON.parse(user);

      if (parsedUser?.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;