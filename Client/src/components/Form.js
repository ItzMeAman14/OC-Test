import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import Modal1 from './Modal1';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.address
    ) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setFormSubmitted(true);
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Registration Form
      </Typography>
      {!formSubmitted ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* Name Field */}
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <div>
            <span>
              Add questions
            </span>
            <Modal1/>
          </div>
          
          {/* Error Message */}
          {error && (
            <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}

          {/* Submit Button */}
          <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
            Submit
          </Button>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Thank you for submitting your information, {formData.name}!
        </Typography>
      )}
    </Container>
  );
};

export default Form;
