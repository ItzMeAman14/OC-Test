import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import { useToast } from '../context/ToastContext'; 
import Cookies from "js-cookie";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { showSuccess, showError, showWarning } = useToast()
  const { setIsAuthenticatedUser ,setIsAuthenticatedAdmin } = useAuth()
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
            setIsAuthenticatedUser(true);
            navigate("/");
          }
          else{
            Cookies.set("adminid",parsed.uid, { expires: 2 })
            Cookies.set("tokenAdmin",parsed.token,{ expires: 1 })
            setIsAuthenticatedAdmin(true);
            navigate("/admin");
          }
          showSuccess(parsed.message); 
        }
        else{
          if(parsed.request){
            showWarning("Request Already Sent to Admin");
          }
          else{
            showError(parsed.message);
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


            <Box sx={{display:'flex',width:'100%',marginTop:2,justifyContent:"space-between"}}>

              <Typography variant="body1">Don't have an account? 
                <Link to="/signup">Signup</Link>
              </Typography>

              <Link to="/forget-password">Forget Password</Link>
            
            </Box>

          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
