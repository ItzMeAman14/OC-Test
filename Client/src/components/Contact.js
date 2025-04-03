import { useState } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from "@mui/material"
import EmailIcon from "@mui/icons-material/Email"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import { toast } from "react-toastify"

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [loading,setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async(e) => {
      e.preventDefault();
  
      if (validateForm()) {
        try{
          setLoading(true)
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/contact-us`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              name:formData.name,
              email:formData.email,
              subject:formData.subject,
              message:formData.message
            })
          })
          const parsed = await res.json();
          if(res.ok){
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
        
        setLoading(false)
        setFormData({
          name: '',
          email: '',
          message: '',
          subject:''
        });
      }
      else {
       setSnackbar({
         open: true,
         message: "Please correct the errors in the form.",
         severity: "error",
       })
     }
    };
  
  const handleCloseSnackbar = () => {
    setSnackbar((prevState) => ({
      ...prevState,
      open: false,
    }))
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Get In Touch
            </Typography>
            <Typography variant="body1" paragraph>
              We're here to help with any questions about our platform, assessments, or services. Fill out the form and
              we'll get back to you as soon as possible.
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{marginBottom:5}}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <EmailIcon sx={{ fontSize: 28, color: "primary.main", mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2">Email Us</Typography>
                    <Typography variant="body2">support@aicomp.com</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <PhoneIcon sx={{ fontSize: 28, color: "primary.main", mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2">Call Us</Typography>
                    <Typography variant="body2">+91 860 4378 314</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Send a Message
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="subject"
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="message"
                    label="Your Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" disabled={loading} variant="contained" size="large" sx={{ mt: 2 }}>
                    {loading ? "Sending" : "Send Message" }
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default About