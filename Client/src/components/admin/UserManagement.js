import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Switch, FormControlLabel, Paper, Divider, TextField, IconButton } from '@mui/material';
import { toast } from "react-toastify";
import SearchIcon from '@mui/icons-material/Search';
import Cookies from "js-cookie";
import { newtonsCradle } from 'ldrs'

newtonsCradle.register()


function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toFilter, setToFilter] = useState('');
    const [statusLoader, setStatusLoader] = useState({status:false,id:null});

    const changeAccess = async (id) => {
        try {
            setStatusLoader({status:true,id:id})
            const token = Cookies.get("tokenAdmin");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/blockUser/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "userAPIKEY": token
                },
            });

            const parsed = await res.json();
            setStatusLoader({status:false,id:null});
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
                                            statusLoader.status && statusLoader.id === user._id 
                                            ?
                                            <l-newtons-cradle
                                            size="78"
                                            speed="1.4" 
                                            color="#0057e5" 
                                            ></l-newtons-cradle>
                                            :
                                            <Switch
                                                checked={user.blocked}
                                                onChange={() => changeAccess(user._id)}
                                                color={user.blocked ? "error" : "primary"}
                                                sx={ user.blocked && {marginRight:3}}
                                            />
                                        }
                                        label={ statusLoader.status && statusLoader.id === user._id ? "" : user.blocked ? 'Blocked' : 'Unblocked'}
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
