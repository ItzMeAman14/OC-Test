import React from 'react';
import { Box, Typography } from '@mui/material';

const NoScoresFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        backgroundColor: '#f4f6f8',
      }}
    >
      <Typography variant="h6" color="text.secondary">
        No scores found
      </Typography>
    </Box>
  );
};

export default NoScoresFound;
