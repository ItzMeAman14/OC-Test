import { useState } from "react"
import {
  Box,
  Button,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material"
import {
  Create as CreateIcon,
  Update as UpdateIcon,
  Message as MessageIcon,
  PersonAdd as PersonAddIcon,
  ManageAccounts as ManageAccountsIcon,
  Score as ScoreIcon,
} from "@mui/icons-material"
import CreateExam from "./CreateExam"
import UpdateExistingExam from "./UpdateExistingExam"
import SendMessage from "./SendMessage"
import UserRequests from "./UserRequests"
import UserManagement from "./UserManagement"
import UserScores from "./UserScores"
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#333333",
      light: "#555555",
      dark: "#111111",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#777777",
      light: "#999999",
      dark: "#555555",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8f8f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#777777",
    },
    divider: "#e0e0e0",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("Create Exam")


  const logout = () => {
    Cookies.remove("adminid");
    Cookies.remove("tokenAdmin");
    toast.success("Logged Out Successfully", {
      autoClose: 5000,
      hideProgressBar: false,
      pauseOnHover: true,
      closeButton: false,
    });
    navigate("/login");
  }

  const menuItems = [
    { text: "Create Exam", icon: <CreateIcon /> },
    { text: "Update Existing Exam", icon: <UpdateIcon /> },
    { text: "Send Message", icon: <MessageIcon /> },
    { text: "User Requests", icon: <PersonAddIcon /> },
    { text: "User Management", icon: <ManageAccountsIcon /> },
    { text: "User Scores", icon: <ScoreIcon /> },
  ]

  const renderContent = () => {
    switch (selectedItem) {
      case "Create Exam":
        return <CreateExam />
      case "Update Existing Exam":
        return <UpdateExistingExam />
      case "Send Message":
        return <SendMessage />
      case "User Requests":
        return <UserRequests />
      case "User Management":
        return <UserManagement />
      case "User Scores":
        return <UserScores />
      default:
        return <CreateExam />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", bgcolor: "background.default" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: "primary.main",
          }}
        >
          <Toolbar sx={{display:"flex",justifyContent:"space-between"}}>
            <Typography variant="h6" noWrap component="div">
              Admin Dashboard
            </Typography>

            <Button variant="h6" component="button" onClick={logout}>LOGOUT</Button>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
              Admin Panel
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selectedItem === item.text}
                  onClick={() => setSelectedItem(item.text)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: selectedItem === item.text ? "primary.contrastText" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            width: `calc(100% - ${drawerWidth}px)`,
            mt: "30px",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              mt:"20px",
              p: 3,
              minHeight: "calc(100vh - 128px)",
              bgcolor: "background.paper",
            }}
          >
            {renderContent()}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  )
}