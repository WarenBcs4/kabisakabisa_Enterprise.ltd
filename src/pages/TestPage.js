import React from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const TestPage = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎉 Login Successful!
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Welcome to BSN Manager
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography><strong>Name:</strong> {user?.fullName}</Typography>
            <Typography><strong>Email:</strong> {user?.email}</Typography>
            <Typography><strong>Role:</strong> {user?.role}</Typography>
            <Typography><strong>Branch ID:</strong> {user?.branchId || 'None'}</Typography>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">
              The system is working correctly! You have successfully logged in and been redirected based on your role.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TestPage;