import React, { useState } from 'react';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import { toast } from "react-toastify";
import { useMessages } from "../context/MessageContext";

function AdminMsg() {
  const { getAllMessages } = useMessages();
  const [message, setMessage] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/msg/new`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          msg:message
        })
      })
      
      const data = await res.json();
      if(res.ok){
        toast.success(data.message, {
          autoClose: 5000, 
          hideProgressBar: false, 
          pauseOnHover: true,
          closeButton: false,
        });
        setMessage('');
        getAllMessages();
      }
      else{
        toast.error(data.message, {
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
            style={{backgroundColor:"white"}}
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
