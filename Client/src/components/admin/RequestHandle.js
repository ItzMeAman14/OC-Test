import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Paper, Divider } from '@mui/material';
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function RequestHandle() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);


    const acceptRequest = async(id) => {
        try{
            const token = Cookies.get("tokenAdmin");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/acceptRequest/${id}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "userAPIKEY":token
                }
            })

            const parsed = await res.json();

            if(res.ok){
                getUsers();
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

    const getUsers = async () => {
        try {
            setLoading(true);
            const token = Cookies.get("tokenAdmin");
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getRequestedUsers`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "userAPIKEY":token
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
                <Box sx={{display:"flex", justifyContent:"space-between"}}>
                    <Typography variant="h4" gutterBottom textAlign="center" marginLeft={5}>
                        User Requests
                    </Typography>

                    <Button sx={{
                            color: "green",
                            borderRadius: 2
                        }}>Accept All</Button>
                </Box>

                <Divider sx={{ marginBottom: 2 }} />

                {
                    loading ? "Loading....." :
                        <List>
                            {
                                users.length === 0 &&
                                <Typography variant='body1'>
                                    No Request Pending
                                </Typography>
                            }
                            {users.map((user) => (
                                <ListItem key={user._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <ListItemText primary={user.email} />

                                    <Button
                                        sx={{
                                            color: "green",
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: 'lightgreen',
                                            },
                                        }}
                                        onClick={() => { acceptRequest(user._id) }}
                                    >
                                        Accept
                                    </Button>

                                </ListItem>
                            ))}
                        </List>
                }
            </Paper>
        </Box>
    );
}

export default RequestHandle;
