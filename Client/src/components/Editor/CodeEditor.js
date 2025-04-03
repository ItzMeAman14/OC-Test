
import React, { useEffect, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Select, MenuItem, FormControl, Button, Box } from '@mui/material';
import handleKeyPress from "../TextEditorFunctions/SpecialCharAutoComplete";

const CodeEditor = ({ 
  code, 
  setCode, 
  language, 
  setLanguage, 
  handleRun,
  isRunning
}) => {
  const textareaRef = useRef(null);
  const lineCountRef = useRef(null);
  
  useEffect(() => {
    if (textareaRef.current && lineCountRef.current) {
      const lineCount = code.split('\n').length;
      const lineNumbers = Array(lineCount).fill().map((_, i) => i + 1).join('\n');
      lineCountRef.current.value = lineNumbers;
      
      textareaRef.current.addEventListener('scroll', syncScroll);
      
      return () => {
        if (textareaRef.current) {
          textareaRef.current.removeEventListener('scroll', syncScroll);
        }
      };
    }
  }, [code]);
  
  const syncScroll = () => {
    if (lineCountRef.current && textareaRef.current) {
      lineCountRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const editorContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '100%'
  };
  
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#333',
    color: 'white'
  };
  
  const editorStyle = {
    display: 'flex',
    flex: 1,
    position: 'relative',
    overflow: 'hidden'
  };
  
  const lineNumbersStyle = {
    width: '40px',
    backgroundColor: '#252525',
    color: '#999',
    fontFamily: 'monospace',
    fontSize: '22px',
    textAlign: 'right',
    padding: '16px 5px 16px 0',
    borderRight: '1px solid #444',
    overflow: 'hidden',
    resize: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none'
  };
  
  const textareaStyle = {
    flex: 1,
    padding: '16px',
    fontFamily: 'monospace',
    fontSize: '22px',
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    border: 'none',
    outline: 'none',
    resize: 'none',
    lineHeight: '1.5',
    overflow: 'auto'
  };
  
  const footerStyle = {
    padding: '12px',
    backgroundColor: '#333',
    display: 'flex',
    justifyContent: 'flex-end'
  };

  return (
    <div style={editorContainerStyle}>
      <div style={headerStyle}>
        <FormControl variant="filled" size="small">
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              backgroundColor: '#444',
              color: 'white',
              minWidth: '120px',
              height: '60px',
              borderRadius: '4px'
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: '#333',
                  color: 'white'
                }
              }
            }}
          >
            <MenuItem value="python3">Python 3</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
          </Select>
        </FormControl>
      </div>
      
      <div style={editorStyle}>
        <textarea
          ref={lineCountRef}
          readOnly
          style={lineNumbersStyle}
          value="1"
          aria-hidden="true"
        />
        
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={ (e) => {handleKeyPress(e,code,setCode) }}
          style={textareaStyle}
          spellCheck={false}
        />
      </div>
      
      <div style={footerStyle}>
        <Button
          onClick={handleRun}
          disabled={isRunning}
          variant="contained"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: isRunning ? '#555' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          <PlayArrowIcon size={16} />
          {isRunning ? 'Running...' : 'Run Code'}
        </Button>
      </div>
    </div>
  );
};

export default CodeEditor;