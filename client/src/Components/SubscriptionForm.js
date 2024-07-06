// src/components/SubscriptionForm.js

import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";

const SubscriptionForm = () => {
  const [storeId, setStoreId] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/assign-subscription",
        {
          storeId,
          subscriptionId,
          duration,
        }
      );
      setMessage(response.data.msg);
    } catch (error) {
      setMessage("Error: " + error.response.data.msg);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Assign Subscription
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Store ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
          />
          <TextField
            label="Subscription ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={subscriptionId}
            onChange={(e) => setSubscriptionId(e.target.value)}
          />
          <TextField
            label="Duration (days)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Assign Subscription
          </Button>
        </form>
        {message && (
          <Typography variant="body1" color="textSecondary" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default SubscriptionForm;
