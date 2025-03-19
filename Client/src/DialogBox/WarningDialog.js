import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning'; // Importing the Warning icon

const WarningDialog = ({ open, setWarning }) => {
  const handleClose = () => {
    setWarning(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon style={{ marginRight: '10px', color: 'orange' }} />
            <Typography variant="h6">Warning</Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            We have detected some unusual activity.
          </Typography>
          <Typography variant="body1" style={{ marginTop: '10px' }}>
            Next time your exam will be automatically submitted.
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

export default WarningDialog;