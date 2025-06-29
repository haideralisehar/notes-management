// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Notes from './components/Notes';
import SignupForm from './Auth/SignupForm';
import SigninForm from './Auth/SigninForm';
import PrivateRoute from './components/PrivateRoute';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<SigninForm />} />

        {/* ✅ Protect Notes route */}
        <Route path="/notes" element={
          <PrivateRoute>
            <Notes />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
