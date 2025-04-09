
import React, { useState } from 'react';
import CodeEditor from './Editor/CodeEditor';
import OutputPanel from './Editor/OutputPanel';
import { Box } from '@mui/material';
import { useToast } from './context/ToastContext'; 

const Home = () => {
  const { showSuccess, showError } = useToast()
  const [code, setCode] = useState('# Write your code here');
  const [language, setLanguage] = useState('python3');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    try {
      setIsRunning(true);
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/execute`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              input:code,
              lang:language,
              userInputs:input,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Network response was not OK');
          }
    
          const data = await response.json();
          if (data.error === 'Daily limit reached') {
            showError('Daily Limit Reached. Come Back Tomorrow.');
          } else {
            showSuccess("Code Compiled Successfully");
          }
          setIsRunning(false);
          setOutput(data.output || data.error);
        } catch (error) {
          setOutput('Error Executing Code: ' + error.message);
          console.error(error);
        }
    
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
    width: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  };
  
  const contentStyle = {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    padding: '16px',
    gap: '16px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5'
  };

  return (
    <Box style={containerStyle}>
      <Box style={contentStyle}>
        <CodeEditor 
          code={code} 
          setCode={setCode} 
          language={language} 
          setLanguage={setLanguage} 
          handleRun={handleRun}
          isRunning={isRunning}
        />
        <OutputPanel 
          output={output} 
          input={input} 
          setInput={setInput} 
        />
      </Box>
    </Box>
  );
};

export default Home;