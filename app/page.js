import * as React from "react";
import { Box, Container, Grid, Card, CardContent, Typography } from "@mui/material";
import { Inventory, Category } from "@mui/icons-material";
import Link from "next/link";

export default function Home() {
  const menuItems = [
    {
      title: "Products",
      icon: <Inventory sx={{ fontSize: 48 }} />,
      description: "Manage your product inventory",
      link: "/product",
      gradient: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
      hoverGradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
    },
    {
      title: "Categories",
      icon: <Category sx={{ fontSize: 48 }} />,
      description: "Organize your product categories",
      link: "/category",
      gradient: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      hoverGradient: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ 
      py: 8,
      background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
      minHeight: '100vh'
    }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2 30%, #2e7d32 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mb: 3
          }}>
          Stock Management
        </Typography>
        <Typography variant="h5" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
            mb: 4
          }}>
          Manage your inventory efficiently
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} key={item.title}>
            <Card
              component={Link}
              href={item.link}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                textDecoration: 'none',
                background: item.gradient,
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
                  background: item.hoverGradient,
                },
              }}
            >
              <CardContent sx={{
                textAlign: 'center',
                p: 4,
              }}>
                <Box sx={{
                  mb: 3,
                  display: 'flex',
                  justifyContent: 'center',
                  '& svg': {
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  }
                }}>
                  {item.icon}
                </Box>
                <Typography variant="h4" component="h2" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                  {item.title}
                </Typography>
                <Typography sx={{ 
                  opacity: 0.9,
                  fontSize: '1.1rem'
                }}>
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
