import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgetPassword = () => {
  const { setIsAuthenticatedRecovery } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState("");
  const [otpBackend, setOtpBackend] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isSendAgainEnabled, setIsSendAgainEnabled] = useState(false);
  const [timer, setTimer] = useState(5);
  const [recoverID, setRecoverID] = useState('');

  const handleVerifyOtp = async () => {
    try {
      if (otp === otpBackend) {
        setShowOtpField(false);
        setOtp("");
        Cookies.set("recoverId",recoverID)
        setIsAuthenticatedRecovery(true);
        navigate(`/new-password/${email}`)
        toast.success("OTP Verified", {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
      else {
        toast.error("Wrong OTP", {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
    }
    catch (err) {
      console.error(err);
    }
  };

  const handleSendAgain = () => {
    setIsSendAgainEnabled(false);
    setTimer(5);

    sendOTP();

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

  const sendOTP = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/sendRecoverOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      })

      const parsed = await res.json();
      if (res.ok) {
        setOtpBackend(parsed.otp);
        setRecoverID(parsed.recoverId)
        setShowOtpField(true);
        toast.success("OTP sent to your mail", {
          autoClose: 5000,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: true,
          hideProgressBar: false,
        });
      }
      else{
        toast.error(parsed.message, {
          autoClose: 5000,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: true,
          hideProgressBar: false,
        });
      }


    }
    catch (err) {
      console.error(err);
    }

  };

  useEffect(() => {
    if (showOtpField) {
      setIsSendAgainEnabled(false);
      setTimer(5);

      let countdown = setInterval(() => {
        setTimer((prev) => {
          console.log(prev)
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
          <Typography variant="h5">Forget Password</Typography>

          <Box component="form" onSubmit={(e) => { e.preventDefault(); sendOTP() }} sx={{ mt: 2, width: "30vw" }}>
            {/* Email Field */}
            <TextField
              label="Type your recovery mail"
              type="email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              Send OTP
            </Button>

          </Box>
        </Box>

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


      </Paper>
    </Container>
  );
};

export default ForgetPassword;
