import React, { useState, useEffect } from 'react';

const Testing = () => {
  const [text, setText] = useState("This is a test sentence with the word 'highlight'.");
  const [formattedText, setFormattedText] = useState("");

  // Function to handle the input in the textarea
  const handleInput = (e) => {
    let updatedText = e.target.value;
    
    // Highlight the word 'highlight' by applying a background color
    updatedText = updatedText.replace(/\b(highlight)\b/g, '<mark>$1</mark>');
    
    setText(updatedText); // Update state with the raw input text
    setFormattedText(updatedText); // Update formatted text for the div
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Hidden Textarea for user input */}
      <textarea
        value={text}
        onChange={handleInput}
        placeholder="Type something..."
        style={{
          position: 'absolute',
          width: '100%',
          height: '200px',
          fontFamily: 'Courier New, monospace',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          backgroundColor: 'transparent',
          color: 'transparent', // Make the text invisible in the textarea itself
          caretColor: 'black', // Make the cursor visible
          zIndex: 1, // Ensure textarea is above the div (not visible)
        }}
      />
      
      {/* Div to display formatted text */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '200px',
          padding: '10px',
          fontFamily: 'Courier New, monospace',
          fontSize: '16px',
          whiteSpace: 'pre-wrap', // Ensure text wraps correctly
          lineHeight: '1.5',
          backgroundColor: 'transparent',
          color: 'black',
          border: '1px solid #ccc',
          borderRadius: '5px',
          pointerEvents: 'none', // Make the div not interactable
          zIndex: 0, // Make sure the div is beneath the textarea
        }}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    </div>
  );
};

export default Testing;
