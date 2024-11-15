import axios from 'axios';

const API_URL = `https://cgi.cse.unsw.edu.au/~cs6080/presto/`;

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
