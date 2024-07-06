import React, { useState } from "react";
import { TextField, Button, Grid, Paper, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [productInfo, setProductInfo] = useState({
    productName: "",
    description: "",
    price: "",
    quantity: "",
    expiryDate: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token found
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/products",
        productInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Product added successfully:", response.data);
      navigate("/product-list");
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(
          error.response.data.errors.reduce((acc, curr) => {
            acc[curr.field] = curr.message;
            return acc;
          }, {})
        );
      } else {
        setErrors({ generic: "Error adding product. Please try again." });
      }
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Add Product
        </Typography>
        {errors.generic && (
          <Typography variant="body1" color="error" gutterBottom>
            {errors.generic}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                error={!!errors.productName}
                helperText={errors.productName}
                label="Product Name"
                name="productName"
                value={productInfo.productName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                error={!!errors.description}
                helperText={errors.description}
                label="Description"
                name="description"
                value={productInfo.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                error={!!errors.price}
                helperText={errors.price}
                label="Price"
                name="price"
                value={productInfo.price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                error={!!errors.quantity}
                helperText={errors.quantity}
                label="Quantity"
                name="quantity"
                value={productInfo.quantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                error={!!errors.expiryDate}
                helperText={errors.expiryDate}
                label="Expiry Date"
                name="expiryDate"
                value={productInfo.expiryDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddProduct;
