import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css"; 
import logo from "../assets/Group 1.svg";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddManufacturerForm, setShowAddManufacturerForm] = useState(false);
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [editEntityId, setEditEntityId] = useState(null); 
  const [buttonText, setButtonText] = useState("Create User");
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email_address: "",
    password: "",
  });
  useEffect(() => {
    if (isEditMode) {
      setButtonText("Edit User");
    } else {
      setButtonText("Create User");
    }
  }, [isEditMode]);
  // State for new manufacturer form
  const [newManufacturer, setNewManufacturer] = useState({
    company_name: "",
    contact_number: "",
    email_address: "",
    password: "",
    country: "",
  });

  // State for new supplier form
  const [newSupplier, setNewSupplier] = useState({
    company_name: "",
    contact_number: "",
    email_address: "",
    password: "",
    country: "",
  });

  const [activeTab, setActiveTab] = useState("users"); // State to manage tabs

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchManufacturers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/manufacturers"
      );
      setManufacturers(response.data);
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchManufacturers();
    fetchSuppliers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/admin/users/${editEntityId}`,
          newUser
        );
      } else {
        await axios.post("http://localhost:5000/admin/users", newUser);
      }
      setNewUser({
        first_name: "",
        last_name: "",
        phone_number: "",
        email_address: "",
        password: "",
      });
      setShowAddUserForm(false);
      setIsEditMode(false);
      setEditEntityId(null);
      setButtonText("Create User");
      fetchUsers();
    } catch (error) {
      console.error("Error adding/updating user:", error);
    }
  };

  const handleAddManufacturer = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/admin/manufacturers/${editEntityId}`,
          newManufacturer
        );
      } else {
        await axios.post(
          "http://localhost:5000/admin/manufacturers",
          newManufacturer
        );
      }
      setNewManufacturer({
        company_name: "",
        contact_number: "",
        email_address: "",
        password: "",
        country: "",
      });
      setShowAddManufacturerForm(false);
      setIsEditMode(false);
      setEditEntityId(null);
      fetchManufacturers();
      setButtonText("Create Manufacturer");
    } catch (error) {
      console.error("Error adding/updating manufacturer:", error);
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/admin/suppliers/${editEntityId}`,
          newSupplier
        );
      } else {
        await axios.post("http://localhost:5000/admin/suppliers", newSupplier);
      }
      setNewSupplier({
        company_name: "",
        contact_number: "",
        email_address: "",
        password: "",
        country: "",
      });
      setShowAddSupplierForm(false);
      setIsEditMode(false);
      setEditEntityId(null);
      setButtonText("Create Supplier");
      fetchSuppliers();
    } catch (error) {
      console.error("Error adding/updating supplier:", error);
    }
  };

  const handleDeleteUser = async (email_address) => {
    try {
      await axios.delete(`http://localhost:5000/admin/users/${email_address}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteManufacturer = async (email_address) => {
    try {
      await axios.delete(
        `http://localhost:5000/admin/manufacturers/${email_address}`
      );
      fetchManufacturers();
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
    }
  };

  const handleDeleteSupplier = async (email_address) => {
    try {
      await axios.delete(
        `http://localhost:5000/admin/suppliers/${email_address}`
      );
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  // Function to handle editing a user
  const handleEditUser = (user) => {
    setNewUser(user); 
    setShowAddUserForm(true); 
    setIsEditMode(true); 
    setEditEntityId(user.email_address); 
  };

  const handleEditManufacturer = (manufacturer) => {
    setNewManufacturer(manufacturer); 
    setShowAddManufacturerForm(true);
    setIsEditMode(true); 
    setEditEntityId(manufacturer.email_address);
  };

  const handleEditSupplier = (supplier) => {
    setNewSupplier(supplier); 
    setShowAddSupplierForm(true); 
    setIsEditMode(true); 
    setEditEntityId(supplier.email_address); 
  };
  return (
    <div>
      <img src={logo} alt="Logo" className="logo" />
      <div className="admin-page">
        <h1>Admin Panel</h1>

        <div className="tab-buttons">
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={activeTab === "manufacturers" ? "active" : ""}
            onClick={() => setActiveTab("manufacturers")}
          >
            Manufacturers
          </button>
          <button
            className={activeTab === "suppliers" ? "active" : ""}
            onClick={() => setActiveTab("suppliers")}
          >
            Suppliers
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "users" && (
            <div className="section">
              <h2>Users</h2>
              <button onClick={() => setShowAddUserForm(true)}>Add User</button>
              {showAddUserForm && (
                <div className="form-popup">
                  <h3>Add User</h3>
                  <form onSubmit={handleAddUser}>
                    <div>
                      <label htmlFor="first_name">First Name:</label>
                      <input
                        type="text"
                        id="first_name"
                        value={newUser.first_name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, first_name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name">Last Name:</label>
                      <input
                        type="text"
                        id="last_name"
                        value={newUser.last_name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, last_name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone_number">Phone Number:</label>
                      <input
                        type="text"
                        id="phone_number"
                        value={newUser.phone_number}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            phone_number: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email_address">Email:</label>
                      <input
                        type="email"
                        id="email_address"
                        value={newUser.email_address}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            email_address: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password">Password:</label>
                      <input
                        type="password"
                        id="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddUserForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit">{buttonText}</button>
                  </form>
                </div>
              )}

              <table className="user-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email_address}>
                      <td>{user.first_name}</td>
                      <td>{user.last_name}</td>
                      <td>{user.phone_number}</td>
                      <td>{user.email_address}</td>
                      <td>
                        <button onClick={() => handleEditUser(user)}>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.email_address)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "manufacturers" && (
            <div className="section">
              <h2>Manufacturers</h2>
              <button onClick={() => setShowAddManufacturerForm(true)}>
                Add Manufacturer
              </button>
              {showAddManufacturerForm && (
                <div className="form-popup">
                  <h3>Add Manufacturer</h3>
                  <form onSubmit={handleAddManufacturer}>
                    <div>
                      <label htmlFor="company_name">Company Name:</label>
                      <input
                        type="text"
                        id="company_name"
                        value={newManufacturer.company_name}
                        onChange={(e) =>
                          setNewManufacturer({
                            ...newManufacturer,
                            company_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contact_number">Contact Number:</label>
                      <input
                        type="text"
                        id="contact_number"
                        value={newManufacturer.contact_number}
                        onChange={(e) =>
                          setNewManufacturer({
                            ...newManufacturer,
                            contact_number: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email_address">Email:</label>
                      <input
                        type="email"
                        id="email_address"
                        value={newManufacturer.email_address}
                        onChange={(e) =>
                          setNewManufacturer({
                            ...newManufacturer,
                            email_address: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password">Password:</label>
                      <input
                        type="password"
                        id="password"
                        value={newManufacturer.password}
                        onChange={(e) =>
                          setNewManufacturer({
                            ...newManufacturer,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="country">Country:</label>
                      <input
                        type="text"
                        id="country"
                        value={newManufacturer.country}
                        onChange={(e) =>
                          setNewManufacturer({
                            ...newManufacturer,
                            country: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddUserForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit">{buttonText}</button>
                  </form>
                </div>
              )}

              <table className="manufacturer-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Contact Number</th>
                    <th>Email</th>
                    <th>Country</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {manufacturers.map((manufacturer) => (
                    <tr key={manufacturer.company_name}>
                      <td>{manufacturer.company_name}</td>
                      <td>{manufacturer.contact_number}</td>
                      <td>{manufacturer.email_address}</td>
                      <td>{manufacturer.country}</td>
                      <td>
                        <button
                          onClick={() => handleEditManufacturer(manufacturer)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteManufacturer(manufacturer.email_address)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "suppliers" && (
            <div className="section">
              <h2>Suppliers</h2>
              <button onClick={() => setShowAddSupplierForm(true)}>
                Add Supplier
              </button>
              {showAddSupplierForm && (
                <div className="form-popup">
                  <h3>Add Supplier</h3>
                  <form onSubmit={handleAddSupplier}>
                    <div>
                      <label htmlFor="company_name">Company Name:</label>
                      <input
                        type="text"
                        id="company_name"
                        value={newSupplier.company_name}
                        onChange={(e) =>
                          setNewSupplier({
                            ...newSupplier,
                            company_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contact_number">Contact Number:</label>
                      <input
                        type="text"
                        id="contact_number"
                        value={newSupplier.contact_number}
                        onChange={(e) =>
                          setNewSupplier({
                            ...newSupplier,
                            contact_number: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email_address">Email:</label>
                      <input
                        type="email"
                        id="email_address"
                        value={newSupplier.email_address}
                        onChange={(e) =>
                          setNewSupplier({
                            ...newSupplier,
                            email_address: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password">Password:</label>
                      <input
                        type="password"
                        id="password"
                        value={newSupplier.password}
                        onChange={(e) =>
                          setNewSupplier({
                            ...newSupplier,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="country">Country:</label>
                      <input
                        type="text"
                        id="country"
                        value={newSupplier.country}
                        onChange={(e) =>
                          setNewSupplier({
                            ...newSupplier,
                            country: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddUserForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit">{buttonText}</button>
                  </form>
                </div>
              )}

              <table className="supplier-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Contact Number</th>
                    <th>Email</th>
                    <th>Country</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.company_name}>
                      <td>{supplier.company_name}</td>
                      <td>{supplier.contact_number}</td>
                      <td>{supplier.email_address}</td>
                      <td>{supplier.country}</td>
                      <td>
                        <button onClick={() => handleEditSupplier(supplier)}>
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteSupplier(supplier.email_address)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
