// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { signupUser } from '../api';
import './SignupForm.css';
import logosImage from "../Assets/logos.png";
import { useNavigate } from "react-router-dom";
import { signinUser } from '../api';

const SigninForm = () => {

  const moveTosignup=()=>{
    navigate('/');

  }
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signinUser(formData);
      const { token, email, username, userId } = response.data;

     // Save token in localStorage
     if (token) {
      localStorage.setItem('authToken', token); // Store token after successful login
      localStorage.setItem('user', JSON.stringify({ email, username, userId })); // Optionally store user data
    }

      showPopup('✅ Login successful!', 'success');

      // Redirect to /notes
      setTimeout(() => {
        navigate('/notes');
      }, 1000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || 'Signin failed. Please try again.';
      showPopup(`⚠️ ${errorMsg}`, 'error');
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <img className="logo_images" src={logosImage} alt="logo" />
        <h2>Login to <span>IdeaNest</span></h2>

        <input
          type="text"
          autoComplete='off'
          name="email"
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          autoComplete='off'
          name="password"
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Login Now</button>
        <p className='login_path'>Create an account?<span onClick={moveTosignup}  >Signup</span> </p>
      </form>

      {popup.show && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default SigninForm;