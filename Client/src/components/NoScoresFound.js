import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const NoScoresFound = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
      >
        <SentimentDissatisfiedIcon color="disabled" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h5" component="h1" gutterBottom>
          No Scores Available
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Scores are currently unavailable. Please check back later.
        </Typography>
      </Box>
    </Container>
  );
};

export default NoScoresFound;