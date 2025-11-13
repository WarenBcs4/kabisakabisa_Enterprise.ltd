import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Collapse
} from '@mui/material';
import {
  Search,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { branchesAPI } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [storeAnchor, setStoreAnchor] = useState(null);
  const [showBranches, setShowBranches] = useState(false);
  const { data: branches = [] } = useQuery('publicBranches', branchesAPI.getPublic);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      {/* Navigation */}
      <Box sx={{ borderBottom: '1px solid #e5e7eb', py: 3 }}>
        <Container maxWidth="xl" sx={{ px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.025em' }}>
              BSN CONSTRUCTION
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Button 
                sx={{ 
                  color: 'black', 
                  fontSize: '0.875rem', 
                  letterSpacing: '0.05em',
                  '&:hover': { opacity: 0.7 }
                }}
                onClick={(e) => setStoreAnchor(e.currentTarget)}
              >
                STORE
              </Button>
              <Button 
                sx={{ 
                  color: 'black', 
                  fontSize: '0.875rem', 
                  letterSpacing: '0.05em',
                  '&:hover': { opacity: 0.7 }
                }}
              >
                ABOUT US
              </Button>
              <IconButton 
                sx={{ 
                  p: 1.5, 
                  '&:hover': { bgcolor: '#f9fafb' },
                  borderRadius: 2
                }}
                onClick={() => navigate('/login')}
              >
                <Search sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Store Dropdown Menu */}
      <Menu
        anchorEl={storeAnchor}
        open={Boolean(storeAnchor)}
        onClose={() => setStoreAnchor(null)}
      >
        {branches.map((branch) => (
          <MenuItem key={branch.id} onClick={() => {
            setStoreAnchor(null);
            setShowBranches(true);
          }}>
            {branch.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ px: 4, py: 10 }}>
        <Grid container spacing={8} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                  mb: 4
                }}
              >
                NEW TILES<br />COLLECTION
              </Typography>
              <Typography variant="h5" sx={{ color: '#6b7280', mb: 4 }}>
                Dealers in tiles collection,
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 2,
                  border: '2px solid black',
                  borderRadius: '50px',
                  color: 'black',
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  '&:hover': {
                    bgcolor: 'black',
                    color: 'white',
                    border: '2px solid black'
                  }
                }}
              >
                Access system
              </Button>
            </Box>
          </Grid>

          {/* Right Images */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ position: 'relative' }}>
              <Grid container spacing={2}>
                {/* Top Left - Gray tile */}
                <Grid item xs={6}>
                  <Box sx={{ 
                    aspectRatio: '1',
                    bgcolor: '#d1d5db',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4
                  }}>
                    <Box sx={{ 
                      width: '100%',
                      height: '66%',
                      border: '4px solid white',
                      borderRadius: 1
                    }} />
                  </Box>
                </Grid>
                
                {/* Top Right - Navy blue */}
                <Grid item xs={6}>
                  <Box sx={{ 
                    aspectRatio: '1',
                    bgcolor: '#1e3a8a',
                    borderRadius: 2
                  }} />
                </Grid>
                
                {/* Bottom Left - Navy sofa scene */}
                <Grid item xs={6}>
                  <Box sx={{ 
                    aspectRatio: '1',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '33%',
                      bgcolor: '#374151'
                    }} />
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: '#60a5fa'
                    }} />
                  </Box>
                </Grid>
                
                {/* Bottom Right - Light room scene */}
                <Grid item xs={6}>
                  <Box sx={{ 
                    aspectRatio: '1',
                    bgcolor: '#f3f4f6',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 80,
                      height: 96,
                      border: '4px solid #fde68a',
                      borderRadius: 1
                    }} />
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '25%',
                      bgcolor: '#fef3c7'
                    }} />
                  </Box>
                </Grid>
              </Grid>
              
              {/* Overlapping center circle */}
              <Box sx={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 128,
                height: 128,
                bgcolor: '#60a5fa',
                borderRadius: '50%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }} />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Store Branches Section */}
      <Collapse in={showBranches}>
        <Box sx={{ bgcolor: '#f9fafb', py: 6 }}>
          <Container maxWidth="xl" sx={{ px: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
              Our Store Locations
            </Typography>
            <Grid container spacing={3} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
              {branches.map((branch) => (
                <Grid item xs={10} sm={6} md={4} key={branch.id}>
                  <Card sx={{ border: '1px solid #e5e7eb', '&:hover': { boxShadow: 2 } }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {branch.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ color: '#6b7280', mr: 1, fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">{branch.address}</Typography>
                      </Box>
                      {branch.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone sx={{ color: '#6b7280', mr: 1, fontSize: 18 }} />
                          <Typography variant="body2" color="text.secondary">{branch.phone}</Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Collapse>

      {/* Decorative Element */}
      <Box sx={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 256,
        height: 256,
        bgcolor: '#f3f4f6',
        borderTopRightRadius: '50%',
        opacity: 0.5,
        zIndex: -1
      }} />
    </Box>
  );
};

export default HomePage;