import React from 'react';
import { TextField, Typography, Box, Paper } from '@mui/material';

const OutputPanel = ({ output, input, setInput }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '100%'
  };
  
  const sectionHeaderStyle = {
    padding: '12px',
    backgroundColor: '#e0e0e0',
    borderBottom: '1px solid #ccc'
  };
  
  const inputSectionStyle = {
    padding: '12px',
    backgroundColor: '#e0e0e0',
    borderBottom: '1px solid #ccc'
  };
  
  const outputContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f8f8',
    border:"1px solid #ccc",
    height:"300px"
  };
  
  const outputTextStyle = {
    flex: 1,
    margin: 0,
    padding: '16px',
    backgroundColor: '#f8f8f8',
    fontFamily: 'monospace',
    fontSize: '22px',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    borderRadius: '8px',
  };

  return (
    <div style={containerStyle}>
      <div style={inputSectionStyle}>
        <Typography variant="h6" style={{ margin: 0, marginBottom: '8px', color: '#333' }}>
          Custom Input
        </Typography>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input for your code here..."
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          style={{ 
            backgroundColor: 'white',
            borderRadius: '4px'
          }}
          InputProps={{
            style: { 
              fontFamily: 'monospace', 
              fontSize: '22px' 
            }
          }}
        />
      </div>
      
      <div style={outputContainerStyle}>
        <div style={sectionHeaderStyle}>
          <Typography variant="h6" style={{ margin: 0, color: '#333' }}>
            Output
          </Typography>
        </div>
        
        <Box component="pre" style={outputTextStyle}>
          {output || 'Run your code to see the output here'}
        </Box>
      </div>
    </div>
  );
};

export default OutputPanel;