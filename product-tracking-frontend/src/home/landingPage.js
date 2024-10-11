import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for programmatic navigation
import logo from "../assets/Group 1.svg"; // Import the logo asset
import "../App.css"; // Import the app-wide CSS
import React, { useState } from "react"; // Import React and useState hook to manage component state
import axios from "axios"; // Import axios for making HTTP requests

const Landing_LoginPage = ({ setIsAuthenticated }) => {
  // State variables to manage email and password input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate for page navigation

  // Function to handle login submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send a POST request to the login API with email and password
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // Check if login was successful
      if (response.data.success) {
        alert("Login Successful!");
        setIsAuthenticated(true); // Set the user as authenticated
        if (response.data.isAdmin) {
          // If the user is an admin, navigate to the admin dashboard
          console.log(`Admin check: ${response.data.isAdmin}`);
          navigate("/admin");
        } else {
          // If the user is not an admin, navigate to the regular app
          navigate("/app");
        }
      } else {
        alert("Invalid credentials"); // Show error if login fails due to wrong credentials
      }
    } catch (err) {
      console.error(err); // Log any error encountered during login
      alert("Login Failed"); // Show error alert for failed login
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
