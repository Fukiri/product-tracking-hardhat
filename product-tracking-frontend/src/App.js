import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import QRCode from "qrcode.react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "./assets/Group 1.svg";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignupPage from "./home/SignupPage";
import LoginPage from "./home/LoginPage";
import LandingPage from "./home/landingPage";
import ProductTrackingABI from "./ProductTrackingABI.json";
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const chainId = 31337; // Chain ID for the local Hardhat network
const accountIndex = 1; // Index of the account you want to use (0 for the first account, 1 for the second, etc.)


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    serialNumber: "",
    manufacturer: "",
    description: "",
    supplyLineAddresses: "",
    currentAddress: "",
    warrantyDetails: "",
    usageInstructions: "",
  });
  const [serialNumberCheck, setSerialNumberCheck] = useState("");
  const [productData, setProductData] = useState(null);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    async function checkProvider() {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Request account access if no accounts are connected
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length === 0) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
          }

          // Request permissions
          const permissions = await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          });

          console.log("Permissions:", permissions);

          // Select the intended account based on the accountIndex
          const selectedAccount = accounts[accountIndex];
          if (!selectedAccount) {
            throw new Error(`Account with index ${accountIndex} not found`);
          }

          const provider = new ethers.providers.Web3Provider(window.ethereum, {
            chainId,
          });
          const signer = provider.getSigner(selectedAccount);
          console.log("Selected Account:", await signer.getAddress());
        } catch (error) {
          if (error.code === -32002) {
            console.error("MetaMask permission request already pending.");
          } else {
            console.error(
              "User denied account access or error occurred:",
              error
            );
          }
        }
      } else {
        console.error("MetaMask not detected");
      }
    }

    checkProvider();
  }, []);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showTrackProductForm, setShowTrackProductForm] = useState(false);
  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSerialNumberCheckChange = (e) => {
    setSerialNumberCheck(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      serialNumber,
      manufacturer,
      description,
      supplyLineAddresses,
      currentAddress,
    } = product;
    const addresses = supplyLineAddresses.split(",");

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum, {
        chainId,
      });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        ProductTrackingABI,
        signer
      );

      try {
        await contract.addProduct(
          name,
          serialNumber,
          manufacturer,
          description,
          addresses,
          currentAddress,
          { gasLimit: 1000000 }
        );
        toast.success("Product added successfully!");
        setQrValue(serialNumber);
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Error adding product!");
      }
    } else {
      toast.error("MetaMask not detected");
    }
  };

  const handleCheckProduct = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum, {
        chainId,
      });
      const contract = new ethers.Contract(
        contractAddress,
        ProductTrackingABI,
        provider
      );

      try {
        const product = await contract.getProduct(serialNumberCheck);
        setProductData(product);
        handleGeofencing(product.currentAddress);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Error fetching product details!");
      }
    } else {
      toast.error("MetaMask not detected");
    }
  };

  const handleGeofencing = (currentAddress) => {
    const allowedArea = [
      // Define the allowed area coordinates as an array of [longitude, latitude] pairs
      [-74.006, 40.7128],
      [-74.006, 40.7138],
      [-74.005, 40.7138],
      [-74.005, 40.7128],
    ];

    const currentCoordinates = currentAddress
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    const isWithinAllowedArea = isPointInPolygon(
      currentCoordinates,
      allowedArea
    );
    if (!isWithinAllowedArea) {
      toast.warn("Product is outside the allowed area!");
    }
  };

  // Helper function to check if a point is inside a polygon
  function isPointInPolygon(point, polygon) {
    const [x, y] = point;
    let isInside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }

    return isInside;
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum, {
        chainId,
      });
      const contract = new ethers.Contract(
        contractAddress,
        ProductTrackingABI,
        provider
      );

      contract.on("ProductUpdated", (serialNumber, newAddress) => {
        console.log(
          `Product ${serialNumber} updated to new address: ${newAddress}`
        );
        toast.info(
          `Product ${serialNumber} updated to new address: ${newAddress}`
        );
      });

      return () => {
        contract.removeAllListeners("ProductUpdated");
      };
    }
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LandingPage setIsAuthenticated={setIsAuthenticated} />}
          />

          <Route path="/" element={<Navigate to="/app" />} />

          <Route
            path="/signup"
            element={<SignupPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />

          {isAuthenticated ? (
            <Route
              path="/app"
              element={
                <div className="wrapper">
                
                  <div className="test">
                    {
                      <div className="wrapper">
                        <img src={logo} alt="" className="logo" />
                        <div className="test">
                          {!showAddProductForm && !showTrackProductForm && (
                            <>
                              <p className="heading1">Welcome to Etherweave</p>
                              <br />
                            </>
                          )}

                          {showAddProductForm && (
                            <>
                              <p className="heading1 addProduct">Add Product</p>
                              <br />
                            </>
                          )}

                          {!showAddProductForm && !showTrackProductForm && (
                            <div className="options">
                              <button
                                className="addPro"
                                onClick={() => {
                                  setShowAddProductForm(true);
                                  setShowTrackProductForm(false);
                                }}
                              >
                                Add Product
                              </button>
                              <button
                                className="trackPro"
                                onClick={() => {
                                  setShowAddProductForm(false);
                                  setShowTrackProductForm(true);
                                }}
                              >
                                Track Product
                              </button>
                            </div>
                          )}

                          {showAddProductForm && (
                            <div>
                              <button
                                className="goBack"
                                onClick={() => {
                                  setShowAddProductForm(false);
                                  setShowTrackProductForm(false);
                                }}
                              >
                                Go Back
                              </button>
                              <form onSubmit={handleSubmit}>
                                <div className="addProDetails">
                                  <input
                                    name="name"
                                    placeholder="Name"
                                    onChange={handleInputChange}
                                  />
                                  <input
                                    name="serialNumber"
                                    placeholder="Serial Number"
                                    onChange={handleInputChange}
                                  />
                                  <input
                                    name="manufacturer"
                                    placeholder="Manufacturer"
                                    onChange={handleInputChange}
                                  />
                                  <input
                                    name="description"
                                    placeholder="Description"
                                    onChange={handleInputChange}
                                  />
                                  <input
                                    name="supplyLineAddresses"
                                    placeholder="Supply Line Addresses "
                                    onChange={handleInputChange}
                                  />
                                  <input
                                    name="currentAddress"
                                    placeholder="Current Address"
                                    onChange={handleInputChange}
                                  />
                                  <input
                                    name="warrantyDetails"
                                    placeholder="Warranty Details"
                                    onChange={handleInputChange}
                                  />
                                  <input
                                    name="usageInstructions"
                                    placeholder="Usage Instructions"
                                    onChange={handleInputChange}
                                  />
                                </div>
                                <br />
                                <button type="submit" className="addProSub">
                                  Add Product
                                </button>
                              </form>
                              <div className="qrCode">
                                {qrValue && <QRCode value={qrValue} />}
                              </div>
                            </div>
                          )}

                          {showTrackProductForm && (
                            <div>
                              <button
                                className="goBack"
                                onClick={() => {
                                  setShowAddProductForm(false);
                                  setShowTrackProductForm(false);
                                }}
                              >
                                Go Back
                              </button>
                              <div className="trackProDetails">
                                <h1 className="heading1 trackProH">
                                  Check Product
                                </h1>
                                <div className="box2">
                                  <input
                                    className="SN"
                                    name="serialNumberCheck"
                                    placeholder="Serial Number"
                                    value={serialNumberCheck}
                                    onChange={handleSerialNumberCheckChange}
                                  />
                                  <button
                                    className="trackProSub"
                                    onClick={handleCheckProduct}
                                  >
                                    Check Product
                                  </button>

                                  <div className="proD">
                                    <h3 className="heading3">
                                      Product Details
                                    </h3>
                                    <div className="margin"></div>
                                    {productData && (
                                      <div className="wrapperPR">
                                        <p>
                                          {" "}
                                          <span className="span1">
                                            Name:{" "}
                                          </span>{" "}
                                          <span className="span2">
                                            {" "}
                                            {productData[0]}
                                          </span>{" "}
                                        </p>
                                        <p>
                                          {" "}
                                          <span className="span1">
                                            Serial Number:{" "}
                                          </span>{" "}
                                          <span className="span2">
                                            {productData[1]}
                                          </span>{" "}
                                        </p>
                                        <p>
                                          {" "}
                                          <span className="span1">
                                            Manufacturer:{" "}
                                          </span>{" "}
                                          <span className="span2">
                                            {" "}
                                            {productData[2]}
                                          </span>
                                        </p>
                                        <p>
                                          {" "}
                                          <span className="span1">
                                            Description:{" "}
                                          </span>{" "}
                                          <span className="span2">
                                            {productData[3]}
                                          </span>{" "}
                                        </p>
                                        <p>
                                          <span className="span1">
                                            {" "}
                                            Supply Line Addresses:{" "}
                                          </span>{" "}
                                          <span className="span2">
                                            {" "}
                                            {productData[4].join(", ")}
                                          </span>
                                        </p>
                                        <p>
                                          {" "}
                                          <span className="span1">
                                            {" "}
                                            Current Address:{" "}
                                          </span>{" "}
                                          <span className="span2">
                                            {" "}
                                            {productData[5]}
                                          </span>
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <ToastContainer />
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            />
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </>
  );
}
export default App;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import QRCode from 'qrcode.react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductTrackingABI from './ProductTrackingABI.json';
import { GeoFence } from 'geofencing';

const contractAddress = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512';
const chainId = 31337; // Chain ID for the local Hardhat network
const accountIndex = 1; // Index of the account you want to use (0 for the first account, 1 for the second, etc.)

function App() {
  const [product, setProduct] = useState({
    name: '',
    serialNumber: '',
    manufacturer: '',
    description: '',
    supplyLineAddresses: '',
    currentAddress: '',
    warrantyDetails: '',
    usageInstructions: ''
  });
  const [productData, setProductData] = useState(null);
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    async function checkProvider() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request account access if no accounts are connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length === 0) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
          }

          // Request permissions
          const permissions = await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
          });

          console.log('Permissions:', permissions);

          // Select the intended account based on the accountIndex
          const selectedAccount = accounts[accountIndex];
          if (!selectedAccount) {
            throw new Error(`Account with index ${accountIndex} not found`);
          }

          const provider = new ethers.providers.Web3Provider(window.ethereum, { chainId });
          const signer = provider.getSigner(selectedAccount);
          console.log('Selected Account:', await signer.getAddress());
        } catch (error) {
          if (error.code === -32002) {
            console.error('MetaMask permission request already pending.');
          } else {
            console.error('User denied account access or error occurred:', error);
          }
        }
      } else {
        console.error('MetaMask not detected');
      }
    }

    checkProvider();
  }, []);

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, serialNumber, manufacturer, description, supplyLineAddresses, currentAddress } = product;
    const addresses = supplyLineAddresses.split(',');

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum, { chainId });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ProductTrackingABI, signer);

      try {
        await contract.addProduct(name, serialNumber, manufacturer, description, addresses, currentAddress, { gasLimit: 1000000 });
        toast.success('Product added successfully!');
        setQrValue(serialNumber);
      } catch (error) {
        console.error('Error adding product:', error);
        toast.error('Error adding product!');
      }
    } else {
      toast.error('MetaMask not detected');
    }
  };

  const handleCheckProduct = async (serialNumber) => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum, { chainId });
      const contract = new ethers.Contract(contractAddress, ProductTrackingABI, provider);

      try {
        const product = await contract.getProduct(serialNumber);
        setProductData(product);
        handleGeofencing(product.currentAddress);
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Error fetching product details!');
      }
    } else {
      toast.error('MetaMask not detected');
    }
  };

  const handleGeofencing = (currentAddress) => {
    const allowedArea = {
      type: 'Polygon',
      coordinates: [
        // Define the allowed area coordinates
      ],
    };

    const isWithinAllowedArea = GeoFence.isPointInPolygon(currentAddress, allowedArea);
    if (!isWithinAllowedArea) {
      toast.warn('Product is outside the allowed area!');
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum, { chainId });
      const contract = new ethers.Contract(contractAddress, ProductTrackingABI, provider);

      contract.on('ProductUpdated', (serialNumber, newAddress) => {
        console.log(`Product ${serialNumber} updated to new address: ${newAddress}`);
        toast.info(`Product ${serialNumber} updated to new address: ${newAddress}`);
      });

      return () => {
        contract.removeAllListeners('ProductUpdated');
      };
    }
  }, []);

  return (
    <div>
      <h1>Product Tracking</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleInputChange} />
        <input name="serialNumber" placeholder="Serial Number" onChange={handleInputChange} />
        <input name="manufacturer" placeholder="Manufacturer" onChange={handleInputChange} />
        <input name="description" placeholder="Description" onChange={handleInputChange} />
        <input name="supplyLineAddresses" placeholder="Supply Line Addresses (comma separated)" onChange={handleInputChange} />
        <input name="currentAddress" placeholder="Current Address" onChange={handleInputChange} />
        <input name="warrantyDetails" placeholder="Warranty Details" onChange={handleInputChange} />
        <input name="usageInstructions" placeholder="Usage Instructions" onChange={handleInputChange} />
        <button type="submit">Add Product</button>
      </form>
      {qrValue && <QRCode value={qrValue} />}
      <div>
        <h2>Check Product</h2>
        <input name="serialNumberCheck" placeholder="Serial Number" onBlur={(e) => handleCheckProduct(e.target.value)} />
        {productData && (
          <div>
            <h3>Product Details</h3>
            <p>Name: {productData[0]}</p>
            <p>Serial Number: {productData[1]}</p>
            <p>Manufacturer: {productData[2]}</p>
            <p>Description: {productData[3]}</p>
            <p>Supply Line Addresses: {productData[4].join(', ')}</p>
            <p>Current Address: {productData[5]}</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
*/
