import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const SideNavbar = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define items for the sidebar menu
  const items = [
    { text: "Dashboard", icon: <InboxIcon />, link: "/" },
    { text: "Add Batch", icon: <AddIcon />, link: "/add-batch" },
    {
      text: "Add Product",
      icon: <ProductionQuantityLimitsIcon />,
      link: "/add-product",
    },
    {
      text: "Batch List",
      icon: <FormatListBulletedIcon />,
      link: "/batch-list",
    },
    {
      text: "Product List",
      icon: <FormatListBulletedIcon />,
      link: "/product-list",
    },
    {
      text: "Expired Product List",
      icon: <FormatListBulletedIcon />,
      link: "/expired-product-list",
    },
    { text: "Settings", icon: <SettingsIcon />, link: "/settings" },
    { text: "Profile", icon: <PersonIcon />, link: "/profile" },
    { text: "Logout", icon: <LogoutIcon />, action: "logout" },
  ];

  // Check if current location is Signup or Login page
  const isAuthPage =
    location.pathname === "/signup" || location.pathname === "/login";

  // Render the sidebar if it's not an authentication page
  if (isAuthPage) {
    return null;
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List>
        {items.map((item, index) => (
          <ListItem
            button
            component={item.action ? "div" : Link}
            to={item.link || ""}
            key={index}
            onClick={item.action === "logout" ? handleLogout : onClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideNavbar;
