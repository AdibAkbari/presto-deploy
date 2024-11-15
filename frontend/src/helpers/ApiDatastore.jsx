import axios from 'axios';
import BACKEND_PORT from '../../backend.config.json';

const API_URL = `http://localhost:${BACKEND_PORT.BACKEND_PORT}`;

export const getStore = (token) => {
  return axios.get(`${API_URL}/store`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateStore = (token, store) => {
  return axios.put(
    `${API_URL}/store`,
    { store },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
