import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import Cookies from "js-cookie";
import Loader from "../Loader";
import { useToast } from '../context/ToastContext';

export default function UserRequest() {
  const { showSuccess, showError } = useToast()
  const [loading,setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")


  const acceptRequest = async (id) => {
    try {
      setLoading(true);
      const token = Cookies.get("tokenAdmin");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/acceptRequest/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        }
      })

      const parsed = await res.json();

      if (res.ok) {
        getUsers();
        showSuccess(parsed.message);
      }
      else {
        showError(parsed.message);
      }
      setLoading(false);
    }
    catch (err) {
      console.error(err);
    }
  }


  const filterUser = async (e) => {
    try {
      setSearchTerm(e.target.value);
      setLoading(true);
      const token = Cookies.get("tokenAdmin");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/filterRequestUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        },
        body: JSON.stringify({
          user: e.target.value
        })
      })

      const parsed = await res.json();

      setRequests(parsed);
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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getRequestedUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        },
      })

      const parsed = await res.json();

      setRequests(parsed);
      setLoading(false);
    }
    catch (err) {
      console.error(err);
    }
  }

  const acceptAll = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("tokenAdmin");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/acceptAllRequest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        },
      })

      const parsed = await res.json();
      if (res.ok) {
        getUsers();
        showSuccess(parsed.message);
      }
      else {
        showError(parsed.message);
      }

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
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: "#333333" }}>
        User Requests
      </Typography>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <TextField
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => filterUser(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#555555" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flexGrow: 1,
            mr: 2,
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
        <Button
          variant="contained"
          color="primary"
          onClick={acceptAll}
          disabled={requests.length === 0}
          sx={{
            bgcolor: "#333333",
            "&:hover": {
              bgcolor: "#555555",
            },
            "&.Mui-disabled": {
              bgcolor: "#cccccc",
            },
          }}
        >
          Accept All
        </Button>
      </Box>
      <Typography variant="subtitle1" sx={{ mb: 2, color: "#555555" }}>
        Pending Requests: {requests.length}
      </Typography>
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
              <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Request Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333333" }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            { loading && 
              ( <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: "#777777" }}>
                  <Loader />
                </TableCell>
              </TableRow> ) }
            {requests.length === 0 ?
              (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: "#777777" }}>
                    No pending requests
                  </TableCell>
                </TableRow>
              ) :

              requests.map((request, index) => (
                <TableRow key={request._id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                  <TableCell sx={{ color: "#333333" }}>{index + 1}</TableCell>
                  <TableCell sx={{ color: "#333333" }}>{request.email}</TableCell>
                  <TableCell sx={{ color: "#333333" }}>{new Date(request.requestDate).toDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => acceptRequest(request._id)}
                      sx={{
                        bgcolor: "#333333",
                        "&:hover": {
                          bgcolor: "#555555",
                        },
                      }}
                    >
                      Accept
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}