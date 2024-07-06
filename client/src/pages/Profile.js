import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect to login if no token found
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get("/api/user/profile", config);
        setProfileData(response.data.user);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        Error fetching profile data: {error}
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {profileData && (
        <div>
          <Typography variant="body1">
            Username: {profileData.username}
          </Typography>
          <Typography variant="body1">Email: {profileData.email}</Typography>
          <Typography variant="body1">
            Store ID: {profileData.storeId}
          </Typography>
          {/* Add more profile data as needed */}
        </div>
      )}
    </div>
  );
};

export default Profile;
