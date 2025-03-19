import React from 'react';
import { Typography, Box } from '@mui/material';

const ExamCompletion = () => {

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      bgcolor="#f5f5f5"
    >
      <Box 
        textAlign="center" 
        p={4} 
        bgcolor="white" 
        borderRadius={2} 
        boxShadow={3}
      >
        <Typography variant="h4" gutterBottom>
          Congratulations!
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          You have successfully completed the exam.
          Submit Exam to see the score.
        </Typography>
      </Box>
    </Box>
  );
};

export default ExamCompletion;
