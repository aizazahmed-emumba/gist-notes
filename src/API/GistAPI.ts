import axios from 'axios';

let token = localStorage.getItem('token');

export const gistAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    "x-Github-Api-Version": "2022-11-28",
    Authorization: token ? `Bearer ${token}` : null  // Set Authorization header if token exists
  }
});

export const updateAuthToken = () => {
  token = localStorage.getItem('token');
  gistAPI.defaults.headers['Authorization'] = token ? `Bearer ${token}` : null;
};

// // Call updateAuthToken() whenever the token changes
// updateAuthToken();
