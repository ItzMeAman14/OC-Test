import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; 
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from "js-cookie";

const ChangePassword = () => {
    const navigate = useNavigate();
    const { email } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((prevState) => !prevState);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((prevState) => !prevState);


    const submitNewPassword = async (e) => {
        e.preventDefault();
        try {
            if(password === confirmPassword){
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/reset-password`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "recoverToken":Cookies.get("recoverId"),
                    },
                    body: JSON.stringify({
                        email,
                        password
                })
            })

            const parsed = await res.json();
            if(res.ok){
                setPassword("");
                setConfirmPassword("");
                Cookies.remove('recoverID');
                navigate("/login");
                toast.success(parsed.message, {
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
        else{
            toast.error('Password Not Matched', {
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
    }

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
                    <Typography variant="h5">Recover Account</Typography>

                    <Box component="form" onSubmit={submitNewPassword} sx={{ mt: 2, width: "30vw" }}>

                        {/* New Password Field */}
                        <TextField
                            label="New Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Confirm Password Field */}
                        <TextField
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3 }}
                        >
                            Change Password
                        </Button>

                    </Box>
                </Box>

            </Paper>
        </Container>
    );
};

export default ChangePassword;