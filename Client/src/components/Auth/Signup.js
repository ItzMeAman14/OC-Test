import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, Container } from "@mui/material";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpBackend, setOtpBackend] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [error, setError] = useState("");
  const [isSendAgainEnabled, setIsSendAgainEnabled] = useState(false);
  const [timer, setTimer] = useState(5); 

  
  const handleRegister = async() => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try{
      const existUser = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getUser?email=${email}`);

      const parsed = await existUser.json();
      
      if(parsed.id){
        toast.error("Account Already Exists", {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
      else if(parsed.request){
        toast.warning("Request Already Sent to Admin", {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
      else{
        setShowOtpField(true);
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
      toast.success("OTP sent to your mail", {
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        closeButton: false,
      });
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
          setShowOtpField(false);
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setOtp("");
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
    }
    else{
      toast.error("Wrong OTP", {
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        closeButton: false,
      });
    }
  };

  const handleSendAgain = () => {
    setIsSendAgainEnabled(false);
    setTimer(5); 

    getOTP();

    let countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setIsSendAgainEnabled(true); 
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (showOtpField) {
      setIsSendAgainEnabled(false);
      setTimer(5);

      let countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setIsSendAgainEnabled(true); 
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [showOtpField]);

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: "url('https://img.freepik.com/free-vector/hand-drawn-school-supplies-pattern-background_23-2150855728.jpg')", // Replace with your background image URL
        backgroundSize: "contain",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" align="center" sx={{ mb: 3 }}>
            Signup
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegister}
            sx={{ mt: 2 }}
          >
            Register
          </Button>

          <Typography variant="body1" sx={{marginLeft:12,marginTop:2}}>Already have an account? 
              <Link to="/login">Login</Link>
          </Typography>

          {showOtpField && (
            <>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Enter OTP sent to your email:
              </Typography>
              <TextField
                label="OTP"
                variant="outlined"
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 6 }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </Button>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  disabled={!isSendAgainEnabled}
                  onClick={handleSendAgain}
                >
                  Send Again {isSendAgainEnabled ? "" : `(${timer}s)`}
                </Button>

              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;
