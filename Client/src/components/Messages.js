import React, { useState } from 'react';
import { Dialog, DialogContent, Typography, Box, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { useMessages } from "./context/MessageContext";

function MessageModal() {
  const { messages } = useMessages();
  const [open, setOpen] = useState(false);

  // Toggle the modal open or closed
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  return (
    <div>
      <IconButton 
        onClick={handleClickOpen} 
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 10,
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: '50%',
          width: 56, 
          height: 56,
          '&:hover': {
            backgroundColor: 'primary.dark',
          }
        }}
      >
        <MessageIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDialog-paper': {
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 500,
            height: 600,
            borderRadius: 3,
            padding: 2,
            boxShadow: 3
          }
        }}
      >
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Messages
          </Typography>
          <Box>
            <List>
              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      display: 'flex',              
                      flexDirection: 'column',
                      alignItems: 'flex-start',     
                      paddingBottom: '10px',
                    }}
                  >
                    
                    {/* Time */}
                    <Typography 
                      variant="body2" 
                      color="textSecondary"
                      sx={{ 
                        fontSize: '0.75rem', 
                      }} 
                    >
                      {new Date(message.createdAt).toLocaleTimeString()} 
                    </Typography>

                    {/* Message   */}
                    <ListItemText primary={message.msg} sx={{textAlign:"justify"}}/>

                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MessageModal;
