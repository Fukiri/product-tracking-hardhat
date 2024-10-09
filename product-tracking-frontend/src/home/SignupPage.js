import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/Group 1.svg";
import { useNavigate } from "react-router-dom";
import "../App.css";

const SignupPage = ({ setIsAuthenticated }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // Default user type
  const [company, setCompany] = useState(""); // For supplier/manufacturer
  const [contact, setContact] = useState(""); // For supplier/manufacturer
  const [country, setCountry] = useState(""); // For supplier/manufacturer
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
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

      alert("Sign Up Successful!");
      setIsAuthenticated(true);
      navigate("/app");
    } catch (err) {
      console.error("Signup failed:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        alert(
          `Sign up failed: ${
            err.response.data.error || err.response.data.message
          }`
        );
      } else {
        alert("Sign up failed. Please try again later.");
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
