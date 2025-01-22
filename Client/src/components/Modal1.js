import React, { useState } from 'react';
import { Modal, Box, TextField, Button, IconButton, Typography, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Modal1(props) {
  const [open, setOpen] = useState(false); 
  const [question, setQuestion] = useState(''); 
  const [statement, setStatement] = useState(''); 
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]); 


  const handleInputChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  const handleSubmit = () => {
    props.sendDataToParent({question,statement,testCases})
    handleClose();
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setQuestion('');
    setStatement('');
    setTestCases([{ input: '', output: '' }]);
  };

  return (
    <div>
      <IconButton
        color="primary"
        onClick={handleOpen}
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1,
          padding: 0,
        }}
        aria-label="add-test-case"
      >
        <AddIcon />
      </IconButton>

      {/* Modal */}
      <Modal open={open} sx={{ overflow: 'auto' }} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              xs: '90%', // 90% width on extra small screens
              sm: 500,   // 500px width on small screens and above
            },
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '80vh', // Limit the height of the modal to 80% of the viewport height
            overflowY: 'auto', // Enable vertical scrolling if content overflows
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
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
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
