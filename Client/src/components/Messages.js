import React, { useState } from 'react';
import { Dialog, DialogContent, Typography, Box, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { useMessages } from "./context/MessageContext";

function MessageModal() {
  const { messages } = useMessages();
  const [open, setOpen] = useState(false);

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
          backgroundColor: '#555555',
          color: 'white',
          borderRadius: '50%',
          width: 56, 
          height: 56,
          '&:hover': {
            backgroundColor: '#333333',
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
              {
               
              messages.length === 0 
              ?
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent:'center',
                  height:'400px',
                  marginTop: 4,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    marginBottom: 2,
                  }}
                >
                  No live Messages.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    color: 'gray',
                  }}
                >
                  Note: All messages will be deleted after 2 day.
                </Typography>
              </Box>
              
              :
              messages.map((message) => (
                <React.Fragment key={message._id}>
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
                      {new Date(message.createdAt).toLocaleTimeString()} -  { new Date(message.createdAt).toLocaleDateString('en-GB') }
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
