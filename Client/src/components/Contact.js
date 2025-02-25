import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { toast } from "react-toastify";

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
    return Object.keys(formErrors).length === 0;
  };


  const handleSubmit = async(e) => {
    e.preventDefault();

    if (validateForm()) {
      try{
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/contact-us`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            name:formData.name,
            email:formData.email,
            message:formData.description
          })
        })
        const parsed = await res.json();
        if(res.ok){
          toast.success(parsed.message, {
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            closeButton: false,
          });
        }
        else{
          toast.error(parsed.message, {
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            closeButton: false,
          });
        }
      }
      catch(err){
        console.error(err);
      }
      
      
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
