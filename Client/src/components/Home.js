import React, { useState } from 'react'; 
import { TextField, Select, MenuItem, Button, Box, Typography, Divider } from '@mui/material'; 
import { toast } from 'react-toastify'; 
import Loader from './Loader'; 
import { useMessages } from './context/MessageContext';

function Home() { 
  const [output, setOutput] = useState(''); 
  const [lang, setLang] = useState('python3'); 
  const [input, setInput] = useState(''); 
  const [load, setLoad] = useState({ loading: false }); 
  const [userInputs, setUserInputs] = useState(''); 

  function handleKeyPress(event) { 
    const { selectionStart, selectionEnd } = event.target; 
    if (event.key === 'Tab') { 
      event.preventDefault(); 
      const start = selectionStart; 
      const end = selectionEnd; 
      const spaces = '    '; 
      setInput(input.substring(0, start) + spaces + input.substring(end));

      setTimeout(() => { 
        event.target.selectionStart = event.target.selectionEnd = start + spaces.length; 
      }, 0); 
    } 

    if (event.key === '(') { 
      event.preventDefault(); 
      setInput(input.substring(0, selectionStart) + '()' + input.substring(selectionEnd));

      setTimeout(() => { 
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 1; 
      }, 0); 
    }

    if (event.key === '{') { 
      event.preventDefault(); 
      setInput(input.substring(0, selectionStart) + '{}' + input.substring(selectionEnd));

      setTimeout(() => { 
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 1; 
      }, 0); 
    } 

    if (event.key === "'") { 
      event.preventDefault(); 
      setInput(input.substring(0, selectionStart) + "''" + input.substring(selectionEnd));

      setTimeout(() => { 
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 1; 
      }, 0); 
    } 

    if (event.key === '"') { 
      event.preventDefault(); 
      setInput(input.substring(0, selectionStart) + '""' + input.substring(selectionEnd));

      setTimeout(() => { 
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 1; 
      }, 0); 
    } 

    if (event.key === '[') { 
      event.preventDefault(); 
      setInput(input.substring(0, selectionStart) + '[]' + input.substring(selectionEnd));

      setTimeout(() => { 
        event.target.selectionStart = event.target.selectionEnd = selectionStart + 1; 
      }, 0); 
    } 

    if (event.key === 'Enter') { 
      const lastKey = input.charAt(input.length - 1); 
      if (lastKey === ':') { 
        event.preventDefault(); 
        setInput(input.substring(0, selectionStart + 1) + '\n    ' + input.substring(selectionEnd));

        setTimeout(() => { 
          event.target.selectionStart = event.target.selectionEnd = selectionStart + 5; 
        }, 0); 
      } 
    }
  }

  const executeCode = async () => { 
    try { 
      setLoad({ loading: true }); 
      const response = await fetch('http://localhost:7123/execute', { 
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

          <TextField
            id="code-editor" 
            multiline 
            rows={13} 
            variant="outlined" 
            placeholder="Write your code here..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={handleKeyPress} 
            fullWidth 
            sx={{
              marginBottom: 2,
              backgroundColor: '#ffffff',
              color: '#000000',
              borderColor: '#ccc',
            }}
          />

          <Button
            id="run-button" 
            variant="contained" 
            color="primary" 
            onClick={executeCode} 
            fullWidth 
            sx={{
              backgroundColor: '#007bff',
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
