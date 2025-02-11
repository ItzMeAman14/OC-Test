import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';

function About() {
  return (
    <Box
      sx={{
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        height: '89vh',
        width:"100%",
        marginTop:30,
        justifyContent: 'center',
      }}
    >
      <Paper sx={{ padding: 3, width: '100%', maxWidth: 800, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          About Online Compiler
        </Typography>

        <Typography variant="body1" paragraph>
          The Online Compiler is a web-based tool that allows you to write, compile, and execute code in various programming languages. It is designed to be fast, easy to use, and accessible from any device with an internet connection. Whether you're a beginner or an experienced developer, this tool is meant to streamline your coding experience without needing to install any software.
        </Typography>

        <Divider sx={{ marginBottom: 2 }} />

        <Typography variant="h6" gutterBottom>
          How to Use the Online Compiler:
        </Typography>

        <List>
          <ListItem>
            <ListItemText
              primary="Step 1: Choose a Programming Language"
              secondary="Select your desired programming language from the available options (e.g., Python, JavaScript, Java, C++)."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Step 2: Write Your Code"
              secondary="Use the provided editor to write your code. You can type directly into the editor or paste your code from your clipboard."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Step 3: Compile the Code"
              secondary="Once you've written your code, click on the 'Compile' button to compile it. The tool will process your code and highlight any errors."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Step 4: Execute Your Code"
              secondary="After compiling your code, click 'Run' to execute it. You can view the output in the console below the editor."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Step 5: Debugging"
              secondary="If you encounter any errors, check the error messages displayed in the console. You can correct your code and re-compile to test again."
            />
          </ListItem>
        </List>

        <Divider sx={{ marginTop: 2 }} />

        <Typography variant="body2" sx={{ marginTop: 3 }} paragraph>
          The Online Compiler is a perfect solution for quick coding tasks, learning new programming languages, or testing small code snippets. It’s fast, intuitive, and free to use. Whether you are practicing coding challenges, debugging, or learning a new language, this tool provides you with all the features you need without the hassle of setting up local development environments.
        </Typography>

      </Paper>
    </Box>
  );
}

export default About;
