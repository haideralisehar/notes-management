// src/components/SignupForm.jsx
import React, { useState, useEffect } from 'react';
import { signupUser } from '../api';
import './SignupForm.css';
import logosImage from "../Assets/logos.png";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/notes');
    }
    else{
      navigate('/');
    }
  }, []);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const showPopup = (message, type = 'success') => {
      setPopup({ show: true, message, type });
      setTimeout(() => {
        setPopup({ show: false, message: '', type: '' });
      }, 3000); // hide after 3 seconds
    };
  
    const handleSubmit = async (e) => {
      
      e.preventDefault();
      try {
        const response = await signupUser(formData);
        const successMsg = response.data?.message || 'Signup successful!';
        showPopup(successMsg, 'success');

       // Save token in localStorage
       const { token, email, username, userId } = response.data;

       if (token) {
         localStorage.setItem('authToken', token);
         localStorage.setItem('user', JSON.stringify({ email, username, userId }));
       }
        setFormData({ username: '', email: '', password: '' });
        setTimeout(() => {
          navigate("/notes"); // 👈 redirect to notes after signup
        }, 1000);
      } catch (error) {
        const errorMsg =
          error.response?.data?.error || 'Signup failed. Please try again.';
        showPopup(`⚠️ ${errorMsg}`, 'error');
      }
    };

    const moveTologin=()=>{
      navigate('/login');
    }
  
    return (
      <div className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
         
          <img className="logo_images" src={logosImage} alt="logo" />
          <h2>Signup to <span>IdeaNest</span> </h2>
          
          <input type="text" autoComplete='off' name="username" placeholder='Username' value={formData.username} onChange={handleChange}  />
          <input type="text" autoComplete='off' name="email" placeholder='Email' value={formData.email} onChange={handleChange}  />
          <input type="password" autoComplete='off' name="password" placeholder='Password' value={formData.password} onChange={handleChange}  />
  
          <button type="submit">Register</button>
          <p className='login_path'>Already have an account?<span  onClick={moveTologin}>Login</span> </p>
        </form>

       
  
        {popup.show && (
          <div className={`popup ${popup.type}`}>
            {popup.message}
          </div>
        )}
      </div>
    );
  };
  
  export default SignupForm;