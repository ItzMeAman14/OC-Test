import React, { useState } from 'react';
import { Modal, Box, TextField, Button, IconButton, Typography, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Modal1() {
  const [open, setOpen] = useState(false); // Modal open/close state
  const [question, setQuestion] = useState(''); // Question input state
  const [description, setDescription] = useState(''); // Description input state
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]); // Array of test cases

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  // Add a new test case
  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  // Handle form submission (could be an API call or saving the data)
  const handleSubmit = () => {
    // Handle form submission logic
    console.log('Form submitted with:', { question, description, testCases });
    handleClose();
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setQuestion('');
    setDescription('');
    setTestCases([{ input: '', output: '' }]);
  };

  return (
    <div>

      <IconButton color="primary" onClick={handleOpen} sx={{
        width: 36,
        height: 36,
        borderRadius: 1,
        padding: 0,
      }}
        aria-label="add-test-case">
        <AddIcon />
      </IconButton>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {/* Modal Header */}
          <Typography variant="h6" component="h2" gutterBottom>
            Add Test Case
          </Typography>

          {/* Form */}
          <TextField
            label="Question"
            variant="outlined"
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Render the Test Cases */}
          <Typography variant="subtitle1" gutterBottom>
            Test Cases:
          </Typography>

          {testCases.map((testCase, index) => (
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
            onClick={handleAddTestCase}
            sx={{ mb: 2 }}
          >
            Add Test Case
          </Button>

          {/* Action buttons */}
          <Stack direction="row" justifyContent="space-between">
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
