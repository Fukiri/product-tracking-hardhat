import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Group 1.svg"; 
import '../App.css'

const LandingPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <div className="wrapper1">
      <img src={logo} alt="Logo" className="logo" />
      <div className="landH">
        <h1 className="landHeading">Let's get started!</h1>
        <div>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
          <button onClick={() => navigate("/login")}>Login</button>
          <button
            onClick={() => {
              setIsAuthenticated(true); 
              navigate("/app"); 
            }}
          >
            Skip SignUp (For Development)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
