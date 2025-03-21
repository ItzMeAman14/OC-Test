import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const MobileWarning = () => {

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column', 
          height: '100vh',
          backgroundColor: '#e3f2fd', 
          padding: 2,
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            padding: 3,
            borderRadius: 2,
            backgroundColor: '#1976d2',
            color: 'white', 
            boxShadow: 3,
            width: '90%', 
            maxWidth: 400,
          }}
        >
          
          <WarningIcon sx={{ fontSize: 60, marginBottom: 2 }} /> 
          
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Warning: Not allowed on mobile screen!
          </Typography>

          <Typography variant="body1" sx={{ fontSize: '1rem' }}>
            Please switch to a laptop or desktop screen for a better experience.
          </Typography>
        </Box>
      </Box>
    );
  }

export default MobileWarning;