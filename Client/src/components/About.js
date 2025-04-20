import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  Divider,
  CardContent,
} from "@mui/material"
import CodeIcon from "@mui/icons-material/Code"
import SpeedIcon from "@mui/icons-material/Speed"
import SecurityIcon from "@mui/icons-material/Security"
import AnalyticsIcon from "@mui/icons-material/Analytics"
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h4" gutterBottom>
        About {process.env.REACT_APP_NAME}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <IntegrationInstructionsIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
              <Typography variant="h5">State-of-the-Art Compiler</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Our online compiler is built with performance and reliability in mind. It supports multiple programming
              languages and provides a seamless coding experience with features like syntax highlighting,
              auto-completion, and error detection.
            </Typography>
            <Typography variant="body1">
              The compiler runs your code in a secure, isolated environment, ensuring that your solutions are tested
              fairly and consistently. Results are provided instantly, allowing you to iterate quickly on your
              solutions.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Supported Languages
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="JavaScript" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Python" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Java" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="C++" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Ruby" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Go" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="PHP" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="C#" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Platform Features
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <CodeIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Multiple Languages
                </Typography>
                <Typography variant="body2">
                  Practice in your preferred programming language with support for all major languages.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <SpeedIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Real-time Feedback
                </Typography>
                <Typography variant="body2">
                  Get instant results and detailed feedback on your code submissions.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <AnalyticsIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Performance Analytics
                </Typography>
                <Typography variant="body2">
                  Track your progress with detailed performance metrics and insights.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <SecurityIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Secure Environment
                </Typography>
                <Typography variant="body2">
                  Code and test in a secure, isolated environment with data protection.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 4, my: 4 }}>

              <Typography variant="h6" gutterBottom>
                How to Use the {process.env.REACT_APP_NAME}:
              </Typography>
      
              <List>
                <ListItem>
                  <ListItemText
                    primary="Step 1: Choose a Programming Language"
                    secondary="Select your desired programming language from the available options (e.g., Python, JavaScript, Java, C++)."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Step 2: Write Your Code"
                    secondary="Use the provided editor to write your code. You can type directly into the editor or paste your code from your clipboard."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Step 3: Execute Your Code"
                    secondary="After compiling your code, click 'Run' to execute it. You can view the output in the console below the editor."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Step 4: Debugging"
                    secondary="If you encounter any errors, check the error messages displayed in the console. You can correct your code and re-run to test again."
                  />
                </ListItem>
              </List>
      
              <Divider sx={{ marginTop: 2 }} />
      
              <Typography variant="h6" gutterBottom>
                Important Instructions for Passing User Input:
              </Typography>
      
              <List>
                <ListItem>
                  <ListItemText
                    primary="Array Input"
                    secondary={`To input an array, write the values without commas (e.g., for an array of numbers: 1 2 3 4). The ${process.env.REACT_APP_NAME} will automatically interpret the space-separated values as elements of the array.`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Multiple Inputs"
                    secondary="If you want to pass multiple inputs, separate them using commas. For example, for two inputs: 'input1,input2'."
                  />
                </ListItem>
              </List>
      </Paper>
      

    </Container>
  )
}

export default About