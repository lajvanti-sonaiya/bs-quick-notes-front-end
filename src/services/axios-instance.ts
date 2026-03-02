import { envObj } from "@/config";
import { getClerkToken } from "../utills/auth-token";
const { default: axios } = require("axios");

export const axiosInstance = axios.create({
  baseURL: envObj.BASE_URL,
});


axiosInstance.interceptors.request.use((config) => {
  const token = getClerkToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});