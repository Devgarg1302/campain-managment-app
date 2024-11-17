import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  
  const login = useGoogleLogin({
      onSuccess: (response) => {
          const token = response.access_token;
          localStorage.setItem("token", token); // Save token in localStorage
          navigate("/"); // Redirect to home page after login
      },
      onError: () => {
          console.error("Login failed");
      },
  });


    return (
        <div className="login-container">
            <h1>Login Page</h1>
            <button onClick={() => login()}>Login with Google</button>
        </div>
    );
};

export default Login;
