import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Stack } from '@mui/material';
  
function Modal1(props) {
  const [heading, setHeading] = useState('');
  const [statement, setStatement] = useState(''); 
  const [testcases, settestcases] = useState([{ input: '', output: '' }]); 


  const handleInputChange = (index, field, value) => {
    const newtestcases = [...testcases];
    newtestcases[index][field] = value;
    settestcases(newtestcases);
  };

  const handleAddTestCase = () => {
    settestcases([...testcases, { input: '', output: '' }]);
  };


  const handleSubmit = () => {
    const exam_id = props.exam_id ?? null
    props.sendDataToParent({statement,testcases,heading,exam_id})
    handleClose();
  };

  const handleClose = () => {
    props.enableModal(false);
    setStatement('');
    settestcases([{ input: '', output: '' }]);
  };

  return (
    <div>
      {/* Modal */}
      <Modal open={true} sx={{ overflow: 'auto' }} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              xs: '90%', 
              sm: 500,   
            },
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {/* Modal Header */}
          <Typography variant="h6" component="h2" gutterBottom>
            Add Question
          </Typography>

          {/* Form */}
          <TextField
            label="Question Heading"
            variant="outlined"
            fullWidth
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Render the Test Cases */}
          <Typography variant="subtitle1" gutterBottom>
            Test Cases:
          </Typography>

          {testcases.map((testCase, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                label={`Input ${index + 1}`}
                variant="outlined"
                fullWidth
                value={testCase.input}
                onChange={(e) => handleInputChange(index, 'input', e.target.value)}
                sx={{ mb: 1 }}
              />
              <TextField
                label={`Output ${index + 1}`}
                variant="outlined"
                fullWidth
                value={testCase.output}
                onChange={(e) => handleInputChange(index, 'output', e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>
          ))}

          {/* Button to add a new test case */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleAddTestCase}
            sx={{ mb: 2 }}
          >
            Add Test Case
          </Button>

          {/* Action buttons */}
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default Modal1;
