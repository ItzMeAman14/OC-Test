import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' }
];

const CodeEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeSection, setActiveSection] = useState('editor');

  const isMobile = useMediaQuery('(max-width:768px)');

  const handleRunCode = () => {
    setOutput(`Language: ${selectedLanguage}\n\nCode:\n${code}\n\nInput:\n${input}`);
    setActiveSection('output');
  };

  return (
    <Box sx={{ height: '90vh', p: 2, bgcolor: '#fff' }}>
      <Box sx={{ height: '100%', maxWidth: '1200px', mx: 'auto' }}>
        {isMobile && (
          <Box sx={{ display: 'flex', mb: 2 }}>
            {['editor', 'input', 'output'].map((section) => (
              <Button
                key={section}
                variant={activeSection === section ? 'contained' : 'outlined'}
                onClick={() => setActiveSection(section)}
                fullWidth
                sx={{ textTransform: 'none', mx: 0.5 }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Button>
            ))}
          </Box>
        )}

        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Left Panel - Editor */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: isMobile && activeSection !== 'editor' ? 'none' : 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Select
              fullWidth
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              sx={{ bgcolor: '#000', color: '#fff' }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>

            <TextField
              multiline
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
              minRows={10}
              maxRows={20}
              sx={{
                flex: 1,
                fontFamily: 'monospace',
                bgcolor: '#f5f5f5'
              }}
            />

            <Button
              onClick={handleRunCode}
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              fullWidth
            >
              Run Code
            </Button>
          </Grid>

          {/* Right Panel - Input & Output */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Box sx={{ display: isMobile && activeSection !== 'input' ? 'none' : 'block', flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Input
              </Typography>
              <TextField
                multiline
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input here..."
                fullWidth
                minRows={5}
                maxRows={20}
                sx={{ bgcolor: '#f5f5f5' }}
              />
            </Box>

            <Box sx={{ display: isMobile && activeSection !== 'output' ? 'none' : 'block', flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Output
              </Typography>
              <TextField
                multiline
                value={output}
                placeholder="Output will appear here..."
                fullWidth
                InputProps={{
                  readOnly: true
                }}
                minRows={5}
                maxRows={20}
                sx={{ bgcolor: '#f5f5f5' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CodeEditor;
