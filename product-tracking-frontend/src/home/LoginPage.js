import React, { useState } from "react"; // Import React and the useState hook to manage component state
import axios from "axios"; // Import axios to make HTTP requests
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation after successful login

// LoginPage component that handles user login
const LoginPage = ({ setIsAuthenticated }) => {
  // State variables to store the email and password entered by the user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

  // Function to handle login when the form is submitted
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send a POST request to the login API with email and password
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // Check if the login was successful
      if (response.data.success) {
        alert("Login Successful!"); // Show success message
        setIsAuthenticated(true); // Set the user as authenticated

        // Redirect based on whether the user is an admin or not
        if (response.data.isAdmin) {
          console.log(`Admin check: ${response.data.isAdmin}`);
          navigate("/admin"); // Navigate to the admin page if the user is an admin
        } else {
          navigate("/app"); // Navigate to the app's main page if the user is not an admin
        }
      } else {
        alert("Invalid credentials"); // Show an error if the login credentials are incorrect
      }
    } catch (err) {
      console.error(err); // Log any errors encountered during the request
      alert("Login Failed"); // Show a general error message if login fails
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
