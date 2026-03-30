import axios from 'axios';

// const API_URL = "http://localhost:8000";
// const BACKUP_API_URL = "https://techendeavorbackend-production.up.railway.app/";
const API_URL = "https://tech-endeavor.fastapicloud.dev/";

const api = axios.create({
  baseURL: API_URL,
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
    const { config } = error;
    
    // If config does not exist or the retry option is not set, reject
    if (!config || !error.response || error.response.status < 500) {
        // We only retry on 5xx or network errors (where error.response might be undefined)
        if (error.response) {
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
