"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
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
  DialogTitle
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function Home() {
  const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null });

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 'medium' }}>{params.value}</Typography>
      )
    },
    { 
      field: 'order', 
      headerName: 'Order', 
      width: 150,
      renderCell: (params) => (
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          px: 2,
          py: 0.5,
          borderRadius: 1
        }}>
          {params.value}
        </Box>
      )
    },
    {
      field: 'Action', 
      headerName: 'Action', 
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton 
              color="primary" 
              onClick={() => startEditMode(params.row)}
              size="small"
            >
              <Edit />
            </IconButton>
            <IconButton 
              color="error" 
              onClick={() => setDeleteDialog({ open: true, category: params.row })}
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
  console.log(process.env.NEXT_PUBLIC_API_URL)

  const [categoryList, setCategoryList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    const c2 = c.map((category) => {
      return {
        ...category,
        id: category._id
      }
    })
    setCategoryList(c2);
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function handleCategoryFormSubmit(data) {
    if (editMode) {
      // Updating a category
      fetch(`${API_BASE}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchCategory()
      });
      return
    }

    // Creating a new category
    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchCategory();
      reset({ name: '', order: '' });
    });
  }

  function startEditMode(category) {
    // console.log(category)
    reset(category);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: '',
      order: ''
    })
    setEditMode(false)
  }

  function handleDeleteConfirm() {
    if (deleteDialog.category) {
      deleteCategory(deleteDialog.category);
      setDeleteDialog({ open: false, category: null });
    }
  }

  function handleDeleteCancel() {
    setDeleteDialog({ open: false, category: null });
  }

  async function deleteCategory(category) {
    const id = category._id
    await fetch(`${API_BASE}/category/${id}`, {
      method: "DELETE"
    })
    fetchCategory()
  }

  return (
    <Container maxWidth="lg" sx={{ 
      py: 4,
      background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
      minHeight: '100vh'
    }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h1" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mb: 2
          }}>
          Category Management
        </Typography>
      </Box>

      <Card sx={{ 
        mb: 4,
        transition: 'transform 0.3s',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editMode ? 'Edit Category' : 'Add New Category'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(handleCategoryFormSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category Name"
                  variant="outlined"
                  {...register("name", { required: true })}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Order"
                  type="number"
                  variant="outlined"
                  {...register("order", { required: true })}
                  size="small"
                />
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
                      Add Category
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ 
        height: 400, 
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      }}>
        <DataGrid
          rows={categoryList}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.08)',
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'transparent',
              borderBottom: '2px solid',
              borderColor: 'primary.light',
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                color: 'primary.main'
              }
            },
            '& .MuiDataGrid-cell': {
              borderColor: 'rgba(224, 224, 224, 0.5)'
            }
          }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{deleteDialog.category?.name}&quot;? This action cannot be undone.
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
