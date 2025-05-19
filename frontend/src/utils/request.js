import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:3004',
  timeout: 20000,
});

export default request;
