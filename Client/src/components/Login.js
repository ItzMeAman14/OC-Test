import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async(event) => {
    event.preventDefault();
    try{
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            email,
            password
          })
        })

        const parsed = await res.json()
        if(res.ok){
          if(parsed.role === "user"){
            Cookies.set("uid",parsed.uid, { expires: 2 })
            Cookies.set("tokenUser",parsed.token,{ expires: 1 })
            navigate("/");
          }
          else{
            Cookies.set("adminid",parsed.uid, { expires: 2 })
            Cookies.set("tokenAdmin",parsed.token,{ expires: 1 })
            navigate("/admin");
          }
          toast.success(parsed.message, { 
            autoClose: 5000, 
            closeButton: false, 
            closeOnClick: false, 
            pauseOnHover: true, 
            hideProgressBar: false, 
          }); 
        }
        else{
          if(parsed.request){
            toast.warning("Request Already Sent to Admin", {
              autoClose: 5000,
              hideProgressBar: false,
              pauseOnHover: true,
              closeButton: false,
            });
          }
          else{
            toast.error(parsed.message, { 
              autoClose: 5000, 
              closeOnClick: false, 
              pauseOnHover: true, 
              hideProgressBar: false, 
              closeButton: false, 
            });
          }
        }
    }
    catch(err){
      console.error(err);
    }    
    
  };
  
  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0, 
        backgroundImage: 'url(https://myultrasoundtutor.com/wp-content/uploads/bg-login.jpg)', // Background image URL
        backgroundSize: 'cover',  
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              Login
            </Button>

            <Typography variant="body1" sx={{marginLeft:12,marginTop:2}}>Don't have an account? 
              <Link to="/signup">Signup</Link>
            </Typography>

          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
