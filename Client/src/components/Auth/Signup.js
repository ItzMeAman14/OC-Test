import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
  Avatar,
  Grid
} from '@mui/material';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import LockIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useToast } from "../context/ToastContext"; 
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpBackend,setOtpBackend] = useState('')
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async(e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      showError("Passwords do not match!");
      return;
    }

    try{
      const existUser = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getUser?email=${email}`);

      const parsed = await existUser.json();
      
      if(parsed.id){
        showError("Account Already Exists");
      }
      else if(parsed.request){
        showWarning("Request Already Sent to Admin");
      }
      else{
        setShowOtp(true);
        getOTP();
    }
    }
    catch(err){
      console.error(err);
    }

  };


  const getOTP = async() => {
    try{
      const otp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/sendOTP`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email
        })
      })
      
      const parsedOTP = await otp.json();
      setOtpBackend(parsedOTP.otp);
      setResendDisabled(true);
      setCountdown(5);
      showSuccess("OTP sent to your mail");
    }
    catch(err){
      console.error(err);
    }
  }

  const handleVerifyOtp = async() => {
    if(otp === otpBackend){
      try{
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            email,
            password
          })
        })

        const parsed = await res.json();
        if(res.ok){
          setShowOtp(false);
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setOtp("");
          showSuccess(parsed.message);
          navigate("/login");
        }
        else{
          showError(parsed.message);
        }
      }
      catch(err){
        console.error(err);
      }
    }
    else{
      showError("Wrong OTP");
    }
  };


  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  return (
    <Box
      minHeight="100vh"
      bgcolor="#f1f1f1"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={3}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box textAlign="center" mb={3}>
          <Avatar
            src="/CCL.ico"
            alt="Logo"
            sx={{
              width: 130,
              height: 130,
              mx: "auto",
              mb: 2,
              bgcolor: "#e0e0e0",
            }}
          />
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            color="text.primary"
            mb={3}
          >
            Register at {process.env.REACT_APP_NAME}
          </Typography>
        </Box>

        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpenIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {!showOtp && (
              <>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#333" } }}
                >
                  Register
                </Button>
              </Grid>

              <div style={{
                width:"100%",
                marginLeft:"90px",
                marginTop: "20px",
                fontSize: "18px"
              }}>
                <Link
                  to="/login"
                  style={{
                    color: "#8E9196",
                    textDecoration: "none",
                  }}
                >
                  Already have an account: Login
                </Link>
              </div>
            </>
            )}

            {showOtp && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleVerifyOtp}
                      sx={{ bgcolor: "#000", color: "#fff", "&:hover": { bgcolor: "#333" } }}
                    >
                      Verify OTP
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled={resendDisabled}
                      onClick={getOTP}
                    >
                      {resendDisabled ? `Resend in ${countdown}s` : "Send Again"}
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;
