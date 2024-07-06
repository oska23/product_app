import React, { useState } from "react";
import {
  Container,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormContainer = styled(Container)({
  marginTop: "32px",
});

const Heading = styled(Typography)({
  marginBottom: "16px",
});

const FormControlWrapper = styled(Grid)({
  marginBottom: "16px",
});

const SaveButton = styled(Button)({
  marginTop: "16px",
});

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  // Check if token exists
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login"); // Redirect to login if no token found
  }

  const handleEmailNotificationsChange = (event) => {
    setEmailNotifications(event.target.checked);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleSaveSettings = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/settings",
        { emailNotifications, theme },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Settings saved:", response.data);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <FormContainer>
      <Heading variant="h4" gutterBottom>
        Settings
      </Heading>
      <Grid container spacing={3}>
        <FormControlWrapper item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={handleEmailNotificationsChange}
              />
            }
            label="Receive Email Notifications"
          />
        </FormControlWrapper>
        <FormControlWrapper item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Theme</InputLabel>
            <Select value={theme} onChange={handleThemeChange}>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>
        </FormControlWrapper>
        <Grid item xs={12}>
          <SaveButton
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
          >
            Save Settings
          </SaveButton>
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default Settings;
