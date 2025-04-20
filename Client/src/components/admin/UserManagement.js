import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import Cookies from "js-cookie";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingUserId, setLoadingUserId] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })


  const changeAccess = async (id) => {
    try {
        setLoadingUserId(id);
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
            setLoadingUserId(null);
            setSnackbar({
              open: true,
              message: parsed.message,
              severity: "success",
            })
        }
        else {
          setSnackbar({
            open: true,
            message: parsed.message,
            severity: "error",
          })
        }
    }
    catch (err) {
        console.error(err);
    }
  
  }
  
      const filterUser = async (e) => {
          try {
              setSearchTerm(e.target.value);
              // setLoading(true);
              const token = Cookies.get("tokenAdmin");
              const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/filterUser`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "userAPIKEY": token
                  },
                  body:JSON.stringify({
                      user:e.target.value
                  })
              })
  
              const parsed = await res.json();
  
              setUsers(parsed);
              // setLoading(false);
          }
          catch (err) {
              console.error(err);
          }
      }
  
  const getUsers = async () => {
    try {
        // setLoading(true);
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
        // setLoading(false);
    }
    catch (err) {
        console.error(err);
    }
  }

  useEffect(() => {
      getUsers();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: "#333333" }}>
        User Management
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => filterUser(e) }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#555555" }}/>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#e0e0e0",
              },
              "&:hover fieldset": {
                borderColor: "#aaaaaa",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#555555",
              },
            },
          }}
        />
        <Typography variant="subtitle1" sx={{ color: "#555555" }}>
          Total Users: {users.length}
        </Typography>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "calc(100vh - 300px)",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>S.No.</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user,index) => (
              <TableRow key={user._id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                <TableCell sx={{ color: "#333333" }}>{index + 1}</TableCell>
                <TableCell sx={{ color: "#333333" }}>{user.email}</TableCell>
                <TableCell>
                  {!user.blocked ? (
                    <Typography sx={{ color: "#333333", fontWeight: "bold" }}>Active</Typography>
                  ) : (
                    <Typography sx={{ color: "#777777" }}>Blocked</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {loadingUserId === user._id ? (
                    <Box sx={{ display: "flex", justifyContent: "center", width: 58 }}>
                      <CircularProgress size={24} sx={{ color: "#555555" }} />
                    </Box>
                  ) : (
                    <Switch
                      checked={user.blocked}
                      onChange={() => changeAccess(user._id)}
                      color="primary"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#333333",
                          "&:hover": {
                            backgroundColor: "rgba(51, 51, 51, 0.04)",
                          },
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#555555",
                        },
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}