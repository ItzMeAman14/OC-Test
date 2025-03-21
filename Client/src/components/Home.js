import React, { useState, useEffect, useRef } from 'react';
import { TextField, Select, MenuItem, Button, Box, Typography, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import Loader from './Loader';
import handleKeyPress from './TextEditorFunctions/SpecialCharAutoComplete';

function Home() {
  const [output, setOutput] = useState('');
  const [lang, setLang] = useState('python3');
  const [input, setInput] = useState('');
  const [load, setLoad] = useState({ loading: false });
  const [userInputs, setUserInputs] = useState('');


  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const getLineNumbers = (text) => {
    const lines = text.split('\n');
    return lines.map((_, index) => index + 1);
  };

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);

      return () => {
        textarea.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const executeCode = async () => {
    try {
      setLoad({ loading: true });
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          lang,
          userInputs,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not OK');
      }

      const data = await response.json();
      if (data.error === 'Daily limit reached') {
        toast.error('Daily Limit Reached. Come Back Tomorrow.', {
          autoClose: 5000,
          closeOnClick: false,
          pauseOnHover: true,
          hideProgressBar: false,
          closeButton: false,
        });
      } else {
        toast.success('Code Compiled Successfully', {
          autoClose: 5000,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: true,
          hideProgressBar: false,
        });
      }
      setLoad({ loading: false });
      setOutput(data.output || data.error);
    } catch (error) {
      setOutput('Error Executing Code: ' + error.message);
      console.error(error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      p={3}
      sx={{
        height: '85vh',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '20px auto',
        marginBottom: 0,
        backgroundColor: '#ffffff',
        color: '#000000',
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      {/* Left Container */}
      <Box flex={1} mr={3}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2, borderRadius: "20px" }}
          >
            <MenuItem value="python3">Python 3</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
          </Select>

          {/* Line Numbers and Textarea */}
                    <div style={{ position: 'relative', display: 'inline-block', width: '100%', border:'2px solid black', borderRadius:10 }}>
                      {/* Line Numbers div */}
                      <div ref={lineNumbersRef} style={{
                        position: 'absolute',
                        top: '13px',
                        left: '8px',
                        background: 'transparent',
                        borderRadius: '5px',
                        width: '40px',
                        maxHeight: '500px',
                        zIndex: '1',
                        pointerEvents: 'none',
                        color: '#000',
                        whiteSpace: 'pre-wrap',
                        fontSize: '20px',
                        overflowY: 'hidden', 
                        height: '500px'
                      }}>
                        {getLineNumbers(input).map((lineNumber) => (
                          <div key={lineNumber}>{lineNumber}</div>
                        ))}
                      </div>
          
                      {/* Textarea Section */}
                      <TextField
                        id="code-editor"
                        multiline
                        placeholder="Write your code here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { handleKeyPress(e,input,setInput) }}
                        ref={textareaRef}
                        fullWidth
                        sx={{
                          maxHeight: '450px',
                          marginBottom: 2,
                          border: 'none',       
                          backgroundColor: '#ffffff',
                          color: '#000000',
                          position: 'relative',
                          paddingLeft: '25px',
                          fontSize: '16px',
                          height: '450px',
                          overflowY: 'auto',
                          resize: 'none',
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',         
                          },
                          '&:focus-visible': {
                            outline: 'none',        
                          }
                        }}
                      />
          
                    </div>

          <Button
            id="run-button"
            variant="contained"
            color="primary"
            onClick={executeCode}
            fullWidth
            sx={{
              backgroundColor: '#007bff',
              margin:2,
              '&:hover': {
                backgroundColor: '#0056b3',
              },
            }}
          >
            Run
          </Button>
        </Box>
      </Box>

      {/* Right Container (Output) */}
      <Box
        flex={1}
        sx={{
          backgroundColor: '#ffffff',
          color: '#000000',
          borderRadius: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
          Output
        </Typography>

        <Divider sx={{ marginBottom: 2 }} />

        <Box
          id="output-con"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          p={2}
          sx={{ backgroundColor: '#ffffff' }}
        >
          <Typography variant="body1">Input Values:</Typography>
          <TextField
            value={userInputs}
            onChange={(i) => setUserInputs(i.target.value)}
            placeholder="Enter user input:"
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <Box
            sx={{
              padding: '10px',
              borderRadius: '5px',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            <Divider sx={{ marginBottom: 2 }} />

            {load.loading ? <Loader /> : output}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
