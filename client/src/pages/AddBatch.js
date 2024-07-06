import React, { useState } from "react";
import { TextField, Button, Grid, Paper, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBatch = () => {
  const [batchInfo, setBatchInfo] = useState({
    batchName: "",
    productionDate: "",
    expiryDate: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBatchInfo((prev) => ({
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
        "http://localhost:5000/api/batches",
        batchInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Batch added successfully:", response.data);
      navigate("/batch-list");
    } catch (error) {
      console.error("Error adding batch:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(
          error.response.data.errors.reduce((acc, curr) => {
            acc[curr.field] = curr.message;
            return acc;
          }, {})
        );
      } else {
        setErrors({ generic: "Error adding batch. Please try again." });
      }
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Add Batch
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
                error={!!errors.batchName}
                helperText={errors.batchName}
                label="Batch Name"
                name="batchName"
                value={batchInfo.batchName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                error={!!errors.productionDate}
                helperText={errors.productionDate}
                label="Production Date"
                name="productionDate"
                value={batchInfo.productionDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                error={!!errors.expiryDate}
                helperText={errors.expiryDate}
                label="Expiry Date"
                name="expiryDate"
                value={batchInfo.expiryDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="number"
                error={!!errors.quantity}
                helperText={errors.quantity}
                label="Quantity"
                name="quantity"
                value={batchInfo.quantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Batch
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddBatch;
