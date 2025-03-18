import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from "./context/AuthContext";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function Navbar() {
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
    <div>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" className="mx-2">
              AlComp
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            {
              isAuthenticatedUser &&
              <Button color="inherit" component={Link} to="/exams">
                Exams
              </Button>
            }
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>
            <Button color="inherit" component={Link} to="/contact">
              Contact
            </Button>
          </Box>
          <Box>
            {
              !isAuthenticatedUser &&
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            }

            {
              !isAuthenticatedUser &&
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            }


            
            {
              isAuthenticatedUser &&
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            }
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
