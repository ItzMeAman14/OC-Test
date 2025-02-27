import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";

// Icons
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Custom Component for Sidebar
import Form from './Form';
import EditExam from './EditExam';
import AdminMsg from "./AdminMsg";
import RequestHandle from "./RequestHandle";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import UserManagement from './UserManagement';
import { toast } from "react-toastify";

const drawerWidth = 240;

function Dashboard(props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [activeComponent, setactiveComponent] = React.useState('dashboard');

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleNavButtons = (active) => {
        setactiveComponent(active);
  }

  const logout = () => {
    Cookies.remove("adminid");
    toast.success("Logged Out Successfully", {
      autoClose: 5000,
      hideProgressBar: false,
      pauseOnHover: true,
      closeButton: false,
    });
    navigate("/login");
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button onClick={ () => { handleNavButtons('dashboard') } }>
          <ListItemIcon>
            <AddCircleIcon />
          </ListItemIcon> 
          <ListItemText primary="Create New Exam" />
        </ListItem>

        <ListItem button onClick={ () => { handleNavButtons('questions') } }>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon> 
          <ListItemText primary="Add Questions to Existing Exam" />
        </ListItem>

        <ListItem button onClick={ () => { handleNavButtons('message') } }>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon> 
          <ListItemText primary="Send Message" />
        </ListItem>

        <ListItem button onClick={ () => { handleNavButtons('handleUsers') } }>
          <ListItemIcon>
            <ManageAccountsIcon />
          </ListItemIcon> 
          <ListItemText primary="Manage Users" />
        </ListItem>

        <ListItem button onClick={ () => { handleNavButtons('requests') } }>
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon> 
          <ListItemText primary="User Requests" />
        </ListItem>

      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            {/* Drawer Icon */}
          </IconButton>
          
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} /> 
          
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)`, backgroundColor:"white", color:"black" } }}
      >
        <Toolbar />
          { activeComponent === 'dashboard' && <Form /> }
          { activeComponent === 'questions' && <EditExam /> }
          { activeComponent === 'message' && <AdminMsg /> }
          { activeComponent === 'handleUsers' && <UserManagement /> }
          { activeComponent === 'requests' && <RequestHandle /> }
      </Box>
    </Box>
  );
}

Dashboard.propTypes = {
  window: PropTypes.func,
};

export default Dashboard;
