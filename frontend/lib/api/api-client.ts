import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:8080",
  timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});
