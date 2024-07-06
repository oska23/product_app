import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [batchCount, setBatchCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token found
        return;
      }

      // Fetch product count
      const productResponse = await axios.get(
        "http://localhost:5000/api/products/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Product count response:", productResponse.data);
      setProductCount(productResponse.data.count);

      // Fetch store count
      const storeResponse = await axios.get(
        "http://localhost:5000/api/stores",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Store count response:", storeResponse.data);
      setStoreCount(storeResponse.data.length);

      // Fetch user count
      const userResponse = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User count response:", userResponse.data);
      setUserCount(userResponse.data.length);

      // Fetch batch count
      const batchResponse = await axios.get(
        "http://localhost:5000/api/batches/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Batch count response:", batchResponse.data);
      setBatchCount(batchResponse.data.count);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Card sx={{ maxWidth: 400 }}>
        <CardMedia
          sx={{ height: 70 }}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {productCount} products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is the number of products tracked by the system.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>

      <Card sx={{ maxWidth: 400 }}>
        <CardMedia sx={{ height: 70 }} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {storeCount} stores
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is the number of stores registered.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>

      <Card sx={{ maxWidth: 400 }}>
        <CardMedia sx={{ height: 70 }} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {userCount} users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is the number of users registered.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>

      <Card sx={{ maxWidth: 400 }}>
        <CardMedia sx={{ height: 70 }} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {batchCount} batches
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is the number of batches created.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Dashboard;
