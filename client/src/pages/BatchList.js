import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "batchName", label: "Batch Name", minWidth: 170 },
  { id: "productionDate", label: "Production Date", minWidth: 100 },
  { id: "expiryDate", label: "Expiry Date", minWidth: 170 },
  {
    id: "quantity",
    label: "Quantity",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedBatchInfo, setUpdatedBatchInfo] = useState({
    batchName: "",
    productionDate: "",
    expiryDate: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token found
        return;
      }

      const response = await axios.get("http://localhost:5000/api/batches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formattedBatches = response.data.map((batch) => ({
        ...batch,
        productionDate: batch.productionDate.split("T")[0], // Extract date part
        expiryDate: batch.expiryDate.split("T")[0], // Extract date part
      }));
      setBatches(formattedBatches);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (batch) => {
    setSelectedBatch(batch);
    setUpdatedBatchInfo(batch);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBatch(null);
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBatchInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token found
        return;
      }

      await axios.put(
        `http://localhost:5000/api/batches/${selectedBatch.id}`,
        updatedBatchInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBatches(); // Refresh the table data
      handleCloseModal();
    } catch (error) {
      console.error("Error updating batch:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token found
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/batches/${selectedBatch.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBatches(); // Refresh the table data
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {batches
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((batch) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={batch.id}
                  onClick={() => handleRowClick(batch)}
                  style={{ cursor: "pointer" }}
                >
                  {columns.map((column) => {
                    const value = batch[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === "productionDate" ||
                        column.id === "expiryDate"
                          ? new Date(value).toLocaleDateString() // Display only date part
                          : column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={batches.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for displaying and updating batch details */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Batch Details
          </Typography>
          {selectedBatch && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="batchName"
                  name="batchName"
                  label="Batch Name"
                  value={updatedBatchInfo.batchName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Production Date"
                  name="productionDate"
                  value={updatedBatchInfo.productionDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Expiry Date"
                  name="expiryDate"
                  value={updatedBatchInfo.expiryDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Quantity"
                  name="quantity"
                  value={updatedBatchInfo.quantity}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                  startIcon={<EditIcon />}
                  sx={{ mr: 2 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </Paper>
  );
};

export default BatchList;
