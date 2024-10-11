const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests

// PostgreSQL pool setup for database connections
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "etherweave",
  password: "aspirine", // PostgreSQL password
  port: 5432,
});

// User sign-up route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body

  try {
    const result = await pool.query(
      "INSERT INTO user_class (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );
    res.status(200).json({ success: true, user: result.rows[0] }); // Return success response
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Sign up failed" });
  }
});

// User login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // Extract login credentials

  try {
    const result = await pool.query(
      "SELECT * FROM user_login WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];

    if (password !== user.password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if user is admin
    const isAdmin = user.email.toLowerCase() === "admin@etherweave.com";
    console.log(`User email: ${user.email}`);
    console.log(`Is Admin: ${isAdmin}`);

    res.status(200).json({ success: true, isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// Sign-up for users, manufacturers, and suppliers
app.post("/signUpSM", async (req, res) => {
  const {
    first_name,
    last_name,
    phone_number,
    email_address,
    password,
    company_name,
    contact_number,
    country,
    user_type,
  } = req.body;

  try {
    // Conditional check based on user type
    if (user_type === "user") {
      const result = await pool.query(
        "INSERT INTO user_class (first_name, last_name, phone_number, email_address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [first_name, last_name, phone_number, email_address, password]
      );
      res.status(200).json({ success: true, user: result.rows[0] });
    } else if (user_type === "manufacturer") {
      const result = await pool.query(
        "INSERT INTO manufacturer_class (company_name, contact_number, email_address, password, country) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [company_name, contact_number, email_address, password, country]
      );
      res.status(200).json({ success: true, user: result.rows[0] });
    } else if (user_type === "supplier") {
      const result = await pool.query(
        "INSERT INTO supplier_class (company_name, contact_number, email_address, password, country) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [company_name, contact_number, email_address, password, country]
      );
      res.status(200).json({ success: true, user: result.rows[0] });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Sign up failed" });
  }
});

// Admin routes to get all users, manufacturers, and suppliers
app.get("/admin/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM user_class");
    res.status(200).json(result.rows); // Fetch and return all users
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

app.get("/admin/manufacturers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM manufacturer_class");
    res.status(200).json(result.rows); // Fetch and return all manufacturers
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch manufacturers" });
  }
});

app.get("/admin/suppliers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM supplier_class");
    res.status(200).json(result.rows); // Fetch and return all suppliers
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch suppliers" });
  }
});

// Admin routes to add users, manufacturers, and suppliers
app.post("/admin/users", async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email_address, password } =
      req.body;
    const result = await pool.query(
      "INSERT INTO user_class (first_name, last_name, phone_number, email_address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, phone_number, email_address, password]
    );
    res.status(201).json({ success: true, user: result.rows[0] }); // Add a new user
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
});

app.post("/admin/manufacturers", async (req, res) => {
  try {
    const { company_name, contact_number, email_address, password, country } =
      req.body;

    const result = await pool.query(
      "INSERT INTO manufacturer_class (company_name, contact_number, email_address, password, country) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [company_name, contact_number, email_address, password, country]
    );
    res.status(201).json({ success: true, manufacturer: result.rows[0] }); // Add a new manufacturer
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create manufacturer" });
  }
});

app.post("/admin/suppliers", async (req, res) => {
  try {
    const { company_name, contact_number, email_address, password, country } =
      req.body;

    const result = await pool.query(
      "INSERT INTO supplier_class (company_name, contact_number, email_address, password, country) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [company_name, contact_number, email_address, password, country]
    );
    res.status(201).json({ success: true, supplier: result.rows[0] }); // Add a new supplier
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create supplier" });
  }
});

// Admin routes to delete users, manufacturers, and suppliers
app.delete("/admin/users/:email_address", async (req, res) => {
  const { email_address } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM user_class WHERE email_address = $1",
      [email_address]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" }); // Delete user
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

app.delete("/admin/manufacturers/:email_address", async (req, res) => {
  const { email_address } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM manufacturer_class WHERE email_address = $1",
      [email_address]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }
    res.status(200).json({ message: "Manufacturer deleted successfully" }); // Delete manufacturer
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete manufacturer" });
  }
});

app.delete("/admin/suppliers/:email_address", async (req, res) => {
  const { email_address } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM supplier_class WHERE email_address = $1",
      [email_address]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json({ message: "Supplier deleted successfully" }); // Delete supplier
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete supplier" });
  }
});

// Admin routes to update users, manufacturers, and suppliers
app.put("/admin/users/:email_address", async (req, res) => {
  const { email_address } = req.params;
  try {
    const { first_name, last_name, phone_number, password } = req.body;

    const result = await pool.query(
      "UPDATE user_class SET first_name = $1, last_name = $2, phone_number = $3, password = $4 WHERE email_address = $5 RETURNING *",
      [first_name, last_name, phone_number, password, email_address]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: result.rows[0] }); // Update user details
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

app.put("/admin/manufacturers/:email_address", async (req, res) => {
  const { email_address } = req.params;
  try {
    const { company_name, contact_number, password, country } = req.body;

    const result = await pool.query(
      "UPDATE manufacturer_class SET company_name = $1, contact_number = $2, password = $3, country = $4 WHERE email_address = $5 RETURNING *",
      [company_name, contact_number, password, country, email_address]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }
    res.status(200).json({
      message: "Manufacturer updated successfully",
      manufacturer: result.rows[0],
    }); // Update manufacturer details
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update manufacturer" });
  }
});

app.put("/admin/suppliers/:email_address", async (req, res) => {
  const { email_address } = req.params;
  try {
    const { company_name, contact_number, password, country } = req.body;

    const result = await pool.query(
      "UPDATE supplier_class SET company_name = $1, contact_number = $2, password = $3, country = $4 WHERE email_address = $5 RETURNING *",
      [company_name, contact_number, password, country, email_address]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json({
      message: "Supplier updated successfully",
      supplier: result.rows[0],
    }); // Update supplier details
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update supplier" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Backend server is running on http://localhost:5000"); // Server running on port 5000
});
