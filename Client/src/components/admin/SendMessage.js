import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material"
import Cookies from "js-cookie";

export default function Testing() {
  const [message, setMessage] = useState('')
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })


  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = Cookies.get("tokenAdmin");
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/msg/new`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "userAPIKEY":token
      },
      body:JSON.stringify({
        msg:message
      })
    })
    
    setMessage("");

    const parsed = await res.json();

    if(res.ok){
      setSnackbar({
        open: true,
        message: parsed.message,
        severity: "success",
      })
    }
    else{
      setSnackbar({
        open: true,
        message: "Some Error Occured",
        severity: "error",
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Send Message
      </Typography>
      <Paper elevation={2} sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <form onSubmit={handleSubmit}>

          <TextField
            fullWidth
            label="Message"
            name="message"
            value={message}
            onChange={(e) => { setMessage(e.target.value) }}
            multiline
            rows={6}
            sx={{ mb: 3 }}
          />

          <Button type="submit" variant="contained" color="primary" size="large" sx={{ minWidth: 120 }}>
            Send
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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