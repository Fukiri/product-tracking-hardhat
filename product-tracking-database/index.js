const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "etherweave",
  password: "aspirine", // add your postgres password here
  port: 5432,
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  

  try {
    const result = await pool.query(
      "INSERT INTO user_class (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );
    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Sign up failed" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

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

    
    const isAdmin = user.email.toLowerCase() === "admin@etherweave.com";
    console.log(`User email: ${user.email}`);
    console.log(`Is Admin: ${isAdmin}`);

    res.status(200).json({ success: true, isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});
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


// Get all users
app.get("/admin/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM user_class");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

// Get all manufacturers
app.get("/admin/manufacturers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM manufacturer_class");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch manufacturers" });
  }
});

// Get all suppliers
app.get("/admin/suppliers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM supplier_class");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch suppliers" });
  }
});

// Add a new user
app.post("/admin/users", async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email_address, password } =
      req.body;
    const result = await pool.query(
      "INSERT INTO user_class (first_name, last_name, phone_number, email_address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, phone_number, email_address, password]
    );
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
});

// Add a new manufacturer
app.post("/admin/manufacturers", async (req, res) => {
  try {
    const { company_name, contact_number, email_address, password, country } =
      req.body;
    
    const result = await pool.query(
      "INSERT INTO manufacturer_class (company_name, contact_number, email_address, password, country) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [company_name, contact_number, email_address, password, country]
    );
    res.status(201).json({ success: true, manufacturer: result.rows[0] });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create manufacturer" });
  }
});

// Add a new supplier
app.post("/admin/suppliers", async (req, res) => {
  try {
    const { company_name, contact_number, email_address, password, country } =
      req.body;
    
    const result = await pool.query(
      "INSERT INTO supplier_class (company_name, contact_number, email_address, password, country) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [company_name, contact_number, email_address, password, country]
    );
    res.status(201).json({ success: true, supplier: result.rows[0] });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create supplier" });
  }
});

// Delete a user
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
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Delete a manufacturer
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
    res.status(200).json({ message: "Manufacturer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete manufacturer" });
  }
});

// Delete a supplier
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
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete supplier" });
  }
});
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
      .json({ message: "User updated successfully", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Update a manufacturer
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
    res
      .status(200)
      .json({
        message: "Manufacturer updated successfully",
        manufacturer: result.rows[0],
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update manufacturer" });
  }
});

// Update a supplier
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
    res
      .status(200)
      .json({
        message: "Supplier updated successfully",
        supplier: result.rows[0],
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update supplier" });
  }
});


app.listen(5000, () => {
  console.log("Backend server is running on http://localhost:5000");
});
