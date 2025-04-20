import React, { useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Stack
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useToast } from './context/ToastContext'; 
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from "js-cookie";

const RecoverAccount = () => {
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate();
  const { email } = useParams();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
        if(newPassword === confirmPassword){
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "recoverToken":Cookies.get("recoverId"),
                },
                body: JSON.stringify({
                    email,
                    newPassword
            })
        })

        const parsed = await res.json();
        if(res.ok){
            setNewPassword("");
            setConfirmPassword("");
            Cookies.remove('recoverID');
            navigate("/login");
            showSuccess(parsed.message);
        }
        else{
            showError(parsed.message);
        }
    }
    else{
        showError('Password Not Matched');
    }
    }
    catch (err) {
        console.error(err);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f1f1f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ width: 500, p: 4 }}>
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
              Recover Account
            </Typography>
          </Box>

          <Stack spacing={2} mt={4}>
            <TextField
              fullWidth
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
            onClick={handleChangePassword}
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
            Change Password
          </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecoverAccount;
