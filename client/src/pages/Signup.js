import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    storeName: "",
    location: "",
    ownerName: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        formData
      );
      console.log(response.data);
      navigate("/"); // Redirect to the dashboard after successful signup
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.response && error.response.data) {
        setError(`error occured`);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign Up
        </Typography>
        {error && (
          <Alert
            severity="error"
            style={{ marginBottom: "1rem", whiteSpace: "pre-wrap" }}
          >
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Store Name"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Owner Name"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact Email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact Phone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>
        <Typography
          variant="body1"
          style={{ marginTop: "1rem", textAlign: "center" }}
        >
          Already have an account?{" "}
          <Link href="/login" color="inherit">
            Login here
          </Link>
        </Typography>
      </div>
    </Container>
  );
};

export default Signup;
