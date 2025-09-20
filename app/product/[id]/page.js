"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Alert
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import Link from "next/link";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("Fetching product detail for id:", params.id);
        const response = await fetch(`${API_BASE}/product/${params.id}`);
        console.log("API response status:", response.status);
        let productData = await response.json();
        console.log("API response data:", productData);

        // If API returns null, fallback to fetch all products and find by id
        if (!productData || !productData._id) {
          const allResponse = await fetch(`${API_BASE}/product`);
          const allProducts = await allResponse.json();
          const found = allProducts.find(p => p._id === params.id);
          if (found) {
            productData = found;
          }
        }

        // Handle if API returns an array
        if (Array.isArray(productData)) {
          productData = productData.length > 0 ? productData[0] : null;
        }
        if (!productData || !productData._id) {
          setProduct(null);
          setError("Product not found");
          setLoading(false);
          return;
        }
        setProduct(productData);

        // Fetch category details if product has a category
        if (productData.category) {
          try {
            const categoryResponse = await fetch(`${API_BASE}/category/${productData.category}`);
            if (categoryResponse.ok) {
              const categoryData = await categoryResponse.json();
              setCategory(categoryData);
            }
          } catch (categoryErr) {
            console.warn('Failed to fetch category:', categoryErr);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete &quot;${product.name}&quot;?`)) return;

    try {
      await fetch(`${API_BASE}/product/${params.id}`, {
        method: "DELETE",
      });
      router.push('/product');
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading product details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.replace(/"/g, '&quot;')}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          component={Link}
          href="/product"
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Product not found
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          component={Link}
          href="/product"
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          component={Link}
          href="/product"
        >
          Back to Products
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            component={Link}
            href="/product"
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {product?.name || 'Product Name'}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Product Code
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {product?.code || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Price
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                ${product?.price || '0'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Category
              </Typography>
              <Box sx={{ mb: 2 }}>
                {category ? (
                  <Chip 
                    label={category.name} 
                    color="primary" 
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1">No category assigned</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {product?.description || 'No description available'}
              </Typography>
            </Grid>

            {(product?.createdAt || product?.updatedAt) && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  {product?.createdAt && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Created At
                      </Typography>
                      <Typography variant="body2">
                        {new Date(product.createdAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                  {product?.updatedAt && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Updated At
                      </Typography>
                      <Typography variant="body2">
                        {new Date(product.updatedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
