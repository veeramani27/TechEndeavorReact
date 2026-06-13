import axios from 'axios';

const API_URL = "http://localhost:8000";
// const BACKUP_API_URL = "https://techendeavorbackend-production.up.railway.app/";
// const API_URL = "https://tech-endeavor.fastapicloud.dev/";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry strategy
const retryIntervals = [1000, 2000, 3000, 4000, 6000, 8000, 10000];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    if (config && error.response && error.response.status === 401 && !(config as any)._retry) {
      (config as any)._retry = true;
      try {
        const res = await axios.post(`${API_URL}/refresh`, {}, { withCredentials: true });
        if (res.data && res.data.access_token) {
          localStorage.setItem('token', res.data.access_token);
          config.headers['Authorization'] = `Bearer ${res.data.access_token}`;
          return api(config);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    if (!config || !error.response || error.response.status < 500) {
        if (error.response && error.response.status !== 401) {
            return Promise.reject(error);
        }
    }

    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount >= retryIntervals.length) {
      return Promise.reject(error);
    }

    const delay = retryIntervals[config.__retryCount];
    config.__retryCount += 1;

    console.log(`Retrying request (${config.__retryCount}/${retryIntervals.length}) after ${delay}ms...`);

    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, delay);
    });

    await backoff;
    return api(config);
  }
);

export default api;
