import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const DangerDialog = ({ open, setDanger, setScores }) => {
  
  const handleClose = () => {
    setDanger(false);
    setScores();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ErrorIcon style={{ marginRight: '10px', color: 'red' }} />
            <Typography variant="h6">Danger</Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Unusual Activity detected!
          </Typography>
          <Typography variant="body1" style={{ marginTop: '10px' }}>
            As warning limit is reached your exam will be submitted as warned before.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DangerDialog;