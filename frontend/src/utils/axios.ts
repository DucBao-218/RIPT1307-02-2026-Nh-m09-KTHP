import axios from 'axios';
import { message } from 'antd';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau';
    message.error(errorMsg);
    return Promise.reject(error);
  }
);

export default axiosInstance;
