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
  InputLabel
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

export default function Home() {
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });

  const columns = [
    { field: 'code', headerName: 'Code', width: 120 },
    { field: 'name', headerName: 'Name', width: 200, flex: 1 },
    { field: 'description', headerName: 'Description', width: 250, flex: 2 },
    { field: 'price', headerName: 'Price', width: 100, valueFormatter: (params) => `$${params.value}` },
    {
      field: 'Action',
      headerName: 'Action',
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
              onClick={() => setDeleteDialog({ open: true, product: params.row })}
              size="small"
            >
              <Delete />
            </IconButton>
          </Box>
        )
      }
    },
  ]

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  console.debug("API_BASE", API_BASE);
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [editMode, setEditMode] = useState(false);

  async function fetchProducts() {
    const data = await fetch(`${API_BASE}/product`);
    const p = await data.json();
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
        fetchProducts()
      });
      return
    }

    createProduct(data);
  };

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

  const productsWithId = products.map((product) => ({
    ...product,
    id: product._id
  }));

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Product Management
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editMode ? 'Edit Product' : 'Add New Product'}
              </Typography>

              <Box component="form" onSubmit={handleSubmit(handleProductFormSubmit)}>
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
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
          <Paper sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={productsWithId}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{deleteDialog.product?.name}&quot;? This action cannot be undone.
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

