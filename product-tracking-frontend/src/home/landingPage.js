import { useNavigate } from "react-router-dom";
import logo from "../assets/Group 1.svg";
import "../App.css";
import React, { useState } from "react";
import axios from "axios";

const Landing_LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      if (response.data.success) {
        alert("Login Successful!");
        setIsAuthenticated(true);
        if (response.data.isAdmin) {
          console.log(`Admin check: ${response.data.isAdmin}`);
          navigate("/admin");
        } else {
          navigate("/app");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Login Failed");
    }
  };

  return (
    <div className="wrapper1">
      <img src={logo} alt="Logo" className="logo" />

      <div className="wrap2">
        <div className="inWrap1">
          <h1 className="landHeading">
            Let's get <br /> started!
          </h1>
        </div>
        <div className="inWrap2">
          <div style={{ textAlign: "center" }}>
            <h1 style={{ marginTop: "-60px" }}>Login</h1>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br />
              <p onClick={() => navigate("/signup")}>
                Don't have an account? Sign up
              </p>
              <button type="submit" onClick={handleLogin}>
                Login
              </button>
            </form>
          </div>
        </div>
        {/* 
        <div className="landH">
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
        */}{" "}
      </div>
      
    </div>
  );
};

export default Landing_LoginPage;
