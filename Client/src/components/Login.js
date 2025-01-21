import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Simple form validation
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    
    // Simulate login logic (you can replace this with an actual API call)
    if (email === 'test@example.com' && password === 'password123') {
      setError('');
      alert('Login Successful');
      // You can redirect the user to the dashboard or home page here
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Container
      component="main"
      maxWidth={false}  // Set to false so it takes up full width
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0, // Remove default padding
        backgroundImage: 'url(https://myultrasoundtutor.com/wp-content/uploads/bg-login.jpg)', // Background image URL
        backgroundSize: 'cover',   // Ensures the image covers the entire container
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
        backgroundAttachment: 'fixed', // Optional for parallax effect
      }}
    >
      <Paper elevation={6} sx={{ padding: 3, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            padding: 2,
          }}
        >
          <Typography variant="h5">Login</Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width:"30vw" }}>
            {/* Email Field */}
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Field */}
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Error Message */}
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
