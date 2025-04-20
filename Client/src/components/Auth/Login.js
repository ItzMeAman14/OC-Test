import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useToast } from '../context/ToastContext';
import Cookies from "js-cookie";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { showSuccess, showError, showWarning } = useToast()
  const { setIsAuthenticatedUser, setIsAuthenticatedAdmin } = useAuth()
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const parsed = await res.json()
      if (res.ok) {
        if (parsed.role === "user") {
          Cookies.set("uid", parsed.uid, { expires: 2 })
          Cookies.set("tokenUser", parsed.token, { expires: 1 })
          setIsAuthenticatedUser(true);
          navigate("/");
        }
        else {
          Cookies.set("adminid", parsed.uid, { expires: 2 })
          Cookies.set("tokenAdmin", parsed.token, { expires: 1 })
          setIsAuthenticatedAdmin(true);
          navigate("/admin");
        }
        showSuccess(parsed.message);
      }
      else {
        if (parsed.request) {
          showWarning("Request Already Sent to Admin");
        }
        else {
          showError(parsed.message);
        }
      }
    }
    catch (err) {
      console.error(err);
    }

  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F1F1F1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          p: 4,
          width: "100%",
          maxWidth: 500,
          bgcolor: "white",
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
            Welcome to {process.env.REACT_APP_NAME}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            required
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            required
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

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
            Login
          </Button>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            fontSize: "18px"
          }}>
            <Link
              to="/signup"
              style={{
                color: "#8E9196",
                textDecoration: "none",
              }}
            >
              Don't have an account: Signup
            </Link>
            <Link
              to="/forget-password"
              style={{
                color: "#8E9196",
                textDecoration: "none",
              }}
            >
              Forget Password
            </Link>
          </div>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;