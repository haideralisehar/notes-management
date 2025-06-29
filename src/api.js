// src/api.js
import axios from 'axios';

const API_BASE_URL = 'https://notes-backend-black.vercel.app/api/tasks'; // Your backend base URL
const API_BASE_URL_AUTH = 'https://notes-backend-black.vercel.app/api/auth';

// Helper function to get JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Task-related API calls
export const createNote = async (noteData) => {
  return await axios.post(`${API_BASE_URL}/createNote`, noteData, {
    headers: { Authorization: `Bearer ${getAuthToken()}` } // Adding token to headers
  });
};

export const getAllNotes = async () => {
  return await axios.get(`${API_BASE_URL}/getAllNotes`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` } // Adding token to headers
  });
};

export const updateNote = async (id, noteData) => {
  return await axios.put(`${API_BASE_URL}/updateNote/${id}`, noteData, {
    headers: { Authorization: `Bearer ${getAuthToken()}` } // Adding token to headers
  });
};

export const deleteNote = async (id) => {
  return await axios.delete(`${API_BASE_URL}/deleteNote/${id}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` } // Adding token to headers
  });
};

// Authentication API calls
export const signupUser = async (userData) => {
  return await axios.post(`${API_BASE_URL_AUTH}/signup`, userData);
};

export const signinUser = async (userData) => {
  // Changed to POST request for login
  return await axios.post(`${API_BASE_URL_AUTH}/login`, userData);
};
