import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SideNavbar from "./Components/SideNavbar";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AddBatch from "./pages/AddBatch";
import AddProduct from "./pages/AddProduct";
import BatchList from "./pages/BatchList";
import ProductList from "./pages/ProductList";
import ExpiredProductList from "./pages/ExpiredProductList";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const App = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl"));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <div>
        <AppBar position="fixed">
          <Toolbar>
            {isSmallScreen && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap>
              My Application
            </Typography>
          </Toolbar>
        </AppBar>
        <SideNavbar open={open} onClose={handleDrawerClose} />
        <main style={{ marginTop: "64px", padding: "16px" }}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-batch" element={<AddBatch />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/batch-list" element={<BatchList />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route
              path="/expired-product-list"
              element={<ExpiredProductList />}
            />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
