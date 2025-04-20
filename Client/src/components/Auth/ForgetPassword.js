import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
} from '@mui/material';
import { MailOutline } from '@mui/icons-material';
import { useToast } from "../context/ToastContext";
import { useAuth } from '../context/AuthContext';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import CryptoJS from "crypto-js";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast()
  const { setIsAuthenticatedRecovery } = useAuth();
  const [recoverID, setRecoverID] = useState('');
  const [email, setEmail] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpBackend, setOtpBackend] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(5);

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
          setShowOtp(true);
          showSuccess("OTP sent to your mail");
      }
      else {
          showError(parsed.message);
      }
    }
    catch (err) {
        console.error(err);
    }

  };

  const handleResendOtp = () => {

    sendOTP();
    setResendDisabled(true);
    setCountdown(5);

  };

  const verifyOtp = () => {
    const encryptedMail = CryptoJS.AES.encrypt(email,process.env.REACT_APP_CRYPTO_KEY).toString()
    try {
        if (otp === otpBackend) {
            setShowOtp(false);
            setOtp("");
            Cookies.set("recoverId", recoverID)
            setIsAuthenticatedRecovery(true);
            navigate(`/new-password/${encryptedMail}`)
            showSuccess("OTP Verified");
        }
        else {
            showError("Wrong OTP");
        }
    }
    catch (err) {
        console.error(err);
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
      setCountdown(5);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  return (

    <div style={{ minHeight: '100vh', backgroundColor: '#f1f1f1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

      <Card sx={{ width: 500, padding: 4 }}>
        <CardContent>
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
            Forget Password
          </Typography>
        </Box>

          <form onSubmit={ (e) => {e.preventDefault(); sendOTP() }} style={{ marginTop: '1.5rem' }}>
            <TextField
              fullWidth
              type="email"
              label="Recovery Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {!showOtp ? (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "#333",
                  "&:hover": {
                    bgcolor: "#222",
                  },
                }}
              >
                Send OTP
              </Button>
            ) : (
              <>
                <TextField
                  fullWidth
                  type="text"
                  label="Enter OTP"
                  variant="outlined"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <div style={{ display: 'flex', gap: '1rem' }}>

                  <Button
                    onClick={verifyOtp}
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      bgcolor: "#333",
                      "&:hover": {
                        bgcolor: "#222",
                      },
                    }}
                  >
                    Verify OTP
                  </Button>
                    
                  
                  <Button
                    onClick={handleResendOtp}
                    variant="outlined"
                    fullWidth
                    disabled={resendDisabled}
                    sx={{
                      mt: 2
                    }}
                  >
                    {resendDisabled ? `Resend in ${countdown}s` : 'Send Again'}
                  </Button>
  
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPassword;
