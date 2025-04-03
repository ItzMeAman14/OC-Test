import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from "./context/AuthContext";
import Cookies from "js-cookie";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticatedUser } = useAuth();

  const logout = () => {
    Cookies.remove("uid");
    Cookies.remove("tokenUser");
    navigate("/login")
    toast.success("Logged Out Successfully", {
      autoClose: 5000,
      hideProgressBar: false,
      pauseOnHover: true,
      closeButton: false,
    });
  }


  return (
    <AppBar position="static" style={{ backgroundColor: '#333' }}>
      <Toolbar>
        {/* Logo/Brand */}
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, color: 'white', fontWeight: 'bold',textDecoration:"none" }}>
          AICOMP
        </Typography>

        {/* Navigation Links */}
        <Box style={{ display: 'flex', marginRight: '20px' }}>
          {
            isAuthenticatedUser &&
          <Button color="inherit" component={Link} to="/exams" style={{ color: 'white' }}>
            Exams
          </Button>
          }
          <Button color="inherit" component={Link} to="/about" style={{ color: 'white' }}>
            About
          </Button>
          <Button color="inherit" component={Link} to="/contact" style={{ color: 'white' }}>
            Contact
          </Button>
        </Box>

        {isAuthenticatedUser ? (
          <Button
            color="inherit"
            onClick={logout}
            style={{
              backgroundColor: '#555',
              color: 'white',
              marginLeft: '10px',
              padding: '6px 16px'
            }}
          >
            Logout
          </Button>
        ) : (
          <Box>
            <Button
              color="inherit"
              component={Link}
              to="/login"
              style={{
                backgroundColor: '#555',
                color: 'white',
                marginLeft: '10px',
                padding: '6px 16px'
              }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/signup"
              style={{
                backgroundColor: '#555',
                color: 'white',
                marginLeft: '10px',
                padding: '6px 16px'
              }}
            >
              Signup
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;