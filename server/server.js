const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();
const port = 5000;

// MySQL connection pool configuration using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
};

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      storeId: user.storeId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
// Route to register a new user and store
app.post("/api/signup", async (req, res, next) => {
  const {
    username,
    password,
    email,
    storeName,
    location,
    ownerName,
    contactEmail,
    contactPhone,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const [storeResult] = await connection.query(
      "INSERT INTO stores (storeName, location, ownerName, contactEmail, contactPhone) VALUES (?, ?, ?, ?, ?)",
      [storeName, location, ownerName, contactEmail, contactPhone]
    );

    const storeId = storeResult.insertId;

    const [userResult] = await connection.query(
      "INSERT INTO users (username, password, email, storeId) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, storeId]
    );

    await connection.commit();
    connection.release();

    const token = generateToken({
      id: userResult.insertId,
      username,
      email,
      storeId,
    });

    res.status(201).json({
      userId: userResult.insertId,
      storeId: storeId,
      username,
      email,
      storeName,
      location,
      ownerName,
      contactEmail,
      contactPhone,
      token,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({
        message: "Duplicate entry",
        errno: err.errno,
        sql: err.sql,
        sqlState: err.sqlState,
        sqlMessage: err.sqlMessage,
      });
    } else {
      res.status(500).json({
        message: "An error occurred while processing your request.",
        errno: err.errno,
        sql: err.sql,
        sqlState: err.sqlState,
        sqlMessage: err.sqlMessage,
      });
    }
  }
});

// Route to login a user
app.post("/api/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      storeId: user.storeId,
    });

    res.json({
      message: "Login successful",
      user: { ...user, password: undefined },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token not found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decodedToken;
    next();
  });
};

// Route to log out a user
app.post("/api/logout", verifyToken, (req, res) => {
  // Invalidate token logic (if using token blacklisting, store the token in a blacklist here)
  res.json({ message: "Logout successful" });
});

// Protected route example
app.get("/api/user/profile", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Route to add a product
app.post("/api/products", verifyToken, async (req, res, next) => {
  const { productName, description, price, quantity, expiryDate } = req.body;
  if (!productName || !description || !price || !quantity || !expiryDate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO products (productName, description, price, quantity, expiryDate) VALUES (?, ?, ?, ?, ?)",
      [productName, description, price, quantity, expiryDate]
    );
    res.status(201).json({
      message: "Product added successfully",
      productId: result.insertId,
    });
  } catch (err) {
    next(err);
  }
});

// Route to fetch products near expiration
app.get(
  "/api/products/near-expiration",
  verifyToken,
  async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM products WHERE expiryDate <= DATE_ADD(NOW(), INTERVAL 2 MONTH) AND expiryDate >= NOW()"
      );
      res.json(rows);
    } catch (err) {
      next(err);
    }
  }
);

// Route to fetch expired products
app.get("/api/products/expired", verifyToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE expiryDate < NOW()"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Route to get all products
app.get("/api/products", verifyToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Route to get a specific product by ID
app.get("/api/products/:id", verifyToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Route to update a product
app.put("/api/products/:id", verifyToken, async (req, res, next) => {
  const { productName, description, price, quantity } = req.body;
  try {
    await pool.query(
      "UPDATE products SET productName = ?, description = ?, price = ?, quantity = ? WHERE id = ?",
      [productName, description, price, quantity, req.params.id]
    );
    res.json({ id: req.params.id, productName, description, price, quantity });
  } catch (err) {
    next(err);
  }
});

// Route to delete a product
app.delete("/api/products/:id", verifyToken, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Route to create a new batch
app.post("/api/batches", verifyToken, async (req, res, next) => {
  const { batchName, productionDate, expiryDate, quantity } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO batches (batchName, productionDate, expiryDate, quantity) VALUES (?, ?, ?, ?)",
      [batchName, productionDate, expiryDate, quantity]
    );
    res.status(201).json({
      id: result.insertId,
      batchName,
      productionDate,
      expiryDate,
      quantity,
    });
  } catch (err) {
    next(err);
  }
});

// Route to update a batch
app.put("/api/batches/:id", verifyToken, async (req, res, next) => {
  const { batchName, productionDate, expiryDate, quantity } = req.body;
  try {
    await pool.query(
      "UPDATE batches SET batchName = ?, productionDate = ?, expiryDate = ?, quantity = ? WHERE id = ?",
      [batchName, productionDate, expiryDate, quantity, req.params.id]
    );
    res.json({
      id: req.params.id,
      batchName,
      productionDate,
      expiryDate,
      quantity,
    });
  } catch (err) {
    next(err);
  }
});

// Route to delete a batch
app.delete("/api/batches/:id", verifyToken, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM batches WHERE id = ?", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Route to get all batches
app.get("/api/batches", verifyToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM batches");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Route to get a specific batch by ID
app.get("/api/batches/:id", verifyToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM batches WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Route to fetch the number of products
app.get("/api/products/count", verifyToken, async (req, res, next) => {
  try {
    const [result] = await pool.query("SELECT COUNT(*) AS count FROM products");
    res.json({ count: result[0].count });
  } catch (err) {
    next(err);
  }
});

// Route to fetch all stores
app.get("/api/stores", verifyToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM stores");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Route to get all users
app.get("/api/users", async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username, email, storeId FROM users"
    );
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Route to fetch the number of batches
app.get("/api/batches/count", verifyToken, async (req, res, next) => {
  try {
    const [result] = await pool.query("SELECT COUNT(*) AS count FROM batches");
    res.json({ count: result[0].count });
  } catch (err) {
    next(err);
  }
});

// Route to fetch user profile data
app.get("/api/user/profile", verifyToken, async (req, res, next) => {
  try {
    // Fetch user data from database based on userId stored in JWT token
    const [userRows] = await pool.query(
      "SELECT id, username, email, storeId FROM users WHERE id = ?",
      [req.user.userId] // Access userId from decoded JWT token
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userRows[0];
    res.json({ user: userData });
  } catch (err) {
    next(err);
  }
});

// Apply the error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
