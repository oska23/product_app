import React from "react";
import { Container, Typography, Box } from "@mui/material";

const MessagePage = () => {
  const message =
    "Your subscription has expired. Please recharge to continue the service.";

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4" component="span">
          {message}
        </Typography>
      </Box>
    </Container>
  );
};

export default MessagePage;
