import React, { useState } from 'react';
import { Dialog, DialogContent, Typography, Box, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';

function MessageModal() {
  const [open, setOpen] = useState(false);

  // Sample messages
  const messages = [
    'Welcome to AICOMP!',
    'This feature is coming soon.'
  ];

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
            width: 300,
            height: 400,
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
                  <ListItem>
                    <ListItemText primary={message} />
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
