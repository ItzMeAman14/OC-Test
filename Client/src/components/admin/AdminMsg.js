import React, { useState } from 'react';
import { TextField, Button, Box, Container, Typography } from '@mui/material';

function AdminMsg() {
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Message submitted: ' + message);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          height: 500,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Send Message to Users
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            multiline
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            sx={{
              backgroundColor: 'white', 
              color: 'black', 
              '& .MuiInputBase-root': {
                border: 0, 
              },
              '& .MuiInputLabel-root': {
                color: 'black', 
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: '16px' }}
          >
            Send Message
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AdminMsg;
