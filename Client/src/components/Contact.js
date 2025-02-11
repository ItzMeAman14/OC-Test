import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    description: ''
  });

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate form data
  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = 'Name is required';
    if (!formData.email) formErrors.email = 'Email is required';
    if (!formData.description) formErrors.description = 'Description is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert('Form submitted successfully!');
      console.log(formData); // Here you can send formData to your API
      setFormData({
        name: '',
        email: '',
        description: ''
      }); // Reset form
    }
  };

  return (
    <Box
      sx={{
        height: '89vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 400,
          padding: 3,
          border: '1px solid #ddd',
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Typography variant="h5" gutterBottom>
          Contact Form
        </Typography>

        {/* Name Field */}
        <TextField
          label="Name"
          variant="outlined"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ marginBottom: 2, color:"white" }}
        />

        {/* Email Field */}
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          sx={{ marginBottom: 2, color:"white" }}
        />

        {/* Description Field */}
        <TextField
          label="Description"
          variant="outlined"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          sx={{ marginBottom: 2 }}
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default Contact;
