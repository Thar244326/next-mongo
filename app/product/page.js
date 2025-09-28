"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

export default function Home() {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    product: null,
  });
  // Update the price column to log the row as well
  const columns = [
    { 
      field: "code", 
      headerName: "Code", 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ 
          bgcolor: 'grey.100',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          fontFamily: 'monospace'
        }}>
          {params.value}
        </Box>
      )
    },
    { 
      field: "name", 
      headerName: "Name", 
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 'medium' }}>{params.value}</Typography>
      )
    },
    { 
      field: "price",
      headerName: "Price",
      width: 120,
      renderCell: (params) => {
        const price = params.row.price;
        if (price === null || price === undefined) return "-";
        const val = Number(price);
        return isNaN(val) ? "-" : (
          <Box sx={{ 
            color: 'success.main',
            fontWeight: 'bold'
          }}>
            ${val.toFixed(2)}
          </Box>
        );
      }
    },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              color="info"
              component={Link}
              href={`/product/${params.row._id}`}
              size="small"
            >
              <Visibility />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => startEditMode(params.row)}
              size="small"
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() =>
                setDeleteDialog({ open: true, product: params.row })
              }
              size="small"
            >
              <Delete />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  console.debug("API_BASE", API_BASE);
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [editMode, setEditMode] = useState(false);

  async function fetchProducts() {
    const data = await fetch(`${API_BASE}/product`);
    const p = await data.json();
    // Log the first product to see its structure
    if (p && p.length > 0) {
      console.log("First product from API:", p[0]);
      console.log("Price value:", p[0].price, "Type:", typeof p[0].price);
    }
    setProducts(p);
  }

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategory(c);
  }

  const createProduct = (data) => {
    fetch(`${API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchProducts());
  };

  function handleProductFormSubmit(data) {
    if (editMode) {
      // Updating a category
      fetch(`${API_BASE}/product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchProducts();
      });
      return;
    }

    createProduct(data);
  }

  function startEditMode(product) {
    reset(product);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: "",
      order: "",
    });
    setEditMode(false);
  }

  function handleDeleteConfirm() {
    if (deleteDialog.product) {
      deleteById(deleteDialog.product._id)();
      setDeleteDialog({ open: false, product: null });
    }
  }

  function handleDeleteCancel() {
    setDeleteDialog({ open: false, product: null });
  }

  const deleteById = (id) => async () => {
    await fetch(`${API_BASE}/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  // Modify the productsWithId mapping to explicitly set the price field
  const productsWithId = products.map((product) => {
    // Log one product after mapping to check if price is preserved
    if (product._id && !window.loggedProduct) {
      console.log("Mapped product:", {...product, id: product._id});
      console.log("Price after mapping:", product.price, "Type:", typeof product.price);
      window.loggedProduct = true;
    }
    
    // Explicitly assign price for MUI DataGrid
    return {
      ...product,
      id: product._id,
      price: product.price, // Force the price field to be correctly set
    };
  });

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" 
          sx={{ 
            fontWeight: 'bold',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: '-8px',
              left: 0,
              width: '60px',
              height: '4px',
              backgroundColor: 'primary.main',
              borderRadius: '2px'
            }
          }}>
          Product Management
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            position: 'sticky',
            top: 20,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
            }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editMode ? "Edit Product" : "Add New Product"}
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit(handleProductFormSubmit)}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Code"
                      variant="outlined"
                      {...register("code", { required: true })}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      variant="outlined"
                      {...register("name", { required: true })}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={3}
                      variant="outlined"
                      {...register("description", { required: true })}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      variant="outlined"
                      {...register("price", { required: true })}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        label="Category"
                        {...register("category", { required: true })}
                        defaultValue=""
                      >
                        {category.map((c) => (
                          <MenuItem key={c._id} value={c._id}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                      }}
                    >
                      {editMode ? (
                        <>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                          >
                            Update
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => stopEditMode()}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                        >
                          Add Product
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            height: 600,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3
          }}>
            <DataGrid
              rows={productsWithId}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
              }}
              sx={{
                '& .MuiDataGrid-row:hover': {
                  bgcolor: 'action.hover',
                },
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'background.default',
                  borderBottom: '2px solid',
                  borderColor: 'divider'
                }
              }}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{deleteDialog.product?.name}
            &quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}