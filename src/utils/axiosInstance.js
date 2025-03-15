import axios from "axios";
import catchErrors from './catchErrors.js';

// Create an Axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Ensure this is set in your .env file
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for handling unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        catchErrors.handle(error);
        if (error.response && error.response.status === 401) {
            // Handle unauthorized case (e.g., logout the user)
            localStorage.removeItem("token");
            window.location.href = "/login"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default api;
