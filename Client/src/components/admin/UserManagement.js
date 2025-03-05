import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Switch, FormControlLabel, Paper, Divider, TextField, IconButton } from '@mui/material';
import { toast } from "react-toastify";
import SearchIcon from '@mui/icons-material/Search';
import Cookies from "js-cookie";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toFilter, setToFilter] = useState('');

    const changeAccess = async (id) => {
        try {
            const token = Cookies.get("tokenAdmin");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/blockUser/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "userAPIKEY": token
                },
            });

            const parsed = await res.json();
            if (res.ok) {
                getUsers();
                toast.success(parsed.message, {
                    autoClose: 5000,
                    hideProgressBar: false,
                    pauseOnHover: true,
                    closeButton: false,
                });
            }
            else {
                toast.error(parsed.message, {
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

    }

    const filterUser = async () => {
        try {
            setLoading(true);
            const token = Cookies.get("tokenAdmin");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/filterUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "userAPIKEY": token
                },
                body:JSON.stringify({
                    user:toFilter
                })
            })

            const parsed = await res.json();

            setUsers(parsed);
            setLoading(false);
        }
        catch (err) {
            console.error(err);
        }
    }

    const getUsers = async () => {
        try {
            setLoading(true);
            const token = Cookies.get("tokenAdmin");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "userAPIKEY": token
                },
            })

            const parsed = await res.json();

            setUsers(parsed);
            setLoading(false);
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <Box
            sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                height: '80vh',
                width: '100%',
                justifyContent: 'center',
            }}
        >
            <Paper sx={{ padding: 3, width: '100%', maxWidth: 800, boxShadow: 3 }}>
                <Box display="flex" sx={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Typography variant="h4" gutterBottom>
                        User Management
                    </Typography>

                    <TextField
                        label="Search user"
                        variant="outlined"
                        sx={{ height: 50, marginBottom:3}}
                        value={toFilter}
                        onChange={(e) => { setToFilter(e.target.value) }}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={filterUser}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'transparent', 
                                        },
                                    }}
                                >
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                    />
                </Box>

                <Divider sx={{ marginBottom: 2 }} />

                {
                    loading ? "Loading....." :
                        <List>
                            {
                                users.length === 0 ?
                                <Typography variant='body1'>
                                    No users Found
                                </Typography>
                            :
                            users.map((user) => (
                                <ListItem key={user._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <ListItemText primary={user.email} />

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={user.blocked}
                                                onChange={() => changeAccess(user._id)}
                                                color={user.blocked ? "error" : "primary"}

                                            />
                                        }
                                        label={user.blocked ? 'Blocked' : 'unblocked'}
                                    />
                                </ListItem>
                            ))}
                        </List>
                }
            </Paper>
        </Box>
    );
}

export default UserManagement;
