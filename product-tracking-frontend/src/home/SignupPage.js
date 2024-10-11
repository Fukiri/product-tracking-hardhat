import React, { useState } from "react"; // Import React and useState hook to manage component state
import axios from "axios"; // Import axios to make HTTP requests
import logo from "../assets/Group 1.svg"; // Import logo asset
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation after successful signup
import "../App.css"; // Import CSS for styling

const SignupPage = ({ setIsAuthenticated }) => {
  // State variables to manage the form input fields
  const [firstName, setFirstName] = useState(""); // For the user's first name
  const [lastName, setLastName] = useState(""); // For the user's last name
  const [phoneNumber, setPhoneNumber] = useState(""); // For the user's phone number
  const [email, setEmail] = useState(""); // For the user's email
  const [password, setPassword] = useState(""); // For the user's password
  const [userType, setUserType] = useState(""); // To capture user type (user, manufacturer, supplier)
  const [company, setCompany] = useState(""); // For supplier/manufacturer's company name
  const [contact, setContact] = useState(""); // For supplier/manufacturer's contact number
  const [country, setCountry] = useState(""); // For supplier/manufacturer's country

  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

  // Function to handle the signup process when the form is submitted
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send a POST request to the signUpSM API with form data
      const response = await axios.post("http://localhost:5000/signUpSM", {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email_address: email,
        password: password,
        company_name: company,
        contact_number: contact,
        country: country,
        user_type: userType,
      });

      // If sign up is successful
      alert("Sign Up Successful!"); // Show a success message
      setIsAuthenticated(true); // Set the user as authenticated
      navigate("/app"); // Redirect to the app's main page
    } catch (err) {
      console.error("Signup failed:", err); // Log any errors encountered during the request

      // Check if there is a response from the server
      if (err.response) {
        console.error("Response data:", err.response.data); // Log the server response
        alert(
          `Sign up failed: ${
            err.response.data.error || err.response.data.message // Display the specific error message from the server
          }`
        );
      } else {
        alert("Sign up failed. Please try again later."); // Display a generic error message if no server response
      }
    }
  };
  return (
    <div className="wrapper1">
      <img src={logo} alt="Logo" className="logo" />
      <div className="signUpWrap" style={{ textAlign: "center" }}>
        <div className="wrap3">
          <p style={{ fontSize: "2.0rem" }}>Create an Etherweave account</p>
          <form onSubmit={handleSignUp} className="signup-form">
            {}
            <div className="form-group userType-group">
              <label
                htmlFor="userType"
                className="userType-label"
                style={{ marginRight: "10px" }}
              >
                Sign Up as:
              </label>
              <select
                id="userType"
                className="userType-select"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="" disabled selected>
                  Select user type
                </option>
                <option value="user">User</option>
                <option value="supplier">Supplier</option>
                <option value="manufacturer">Manufacturer</option>
              </select>
            </div>

            {}
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {}
            {(userType === "user" || userType === "") && (
              <div className="form-group">
                <input
                  type="text"
                  placeholder="First Name"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="form-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            )}

            {}
            {(userType === "supplier" || userType === "manufacturer") && (
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Company Name"
                  className="form-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  className="form-input"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  className="form-input"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            )}
            <button onClick={() => navigate(-1)} className="go-back-button">
              Go Back
            </button>
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
