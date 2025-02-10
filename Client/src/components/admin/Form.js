import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import Modal1 from '../Modal1';
import Toast from '../Toast';

const Form = () => {
  const [questions, setquestions] = useState([]);
  const [name, setName] = useState('');
  const [toast, setToast] = useState({status:false,msg:'',type:''});
  const [modal, setModal] = useState(false);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const response = await fetch("http://localhost:7123/createExam",{
      "method":"POST",
      "headers":{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        questions
      })
    })
    
    const parsedRes = await response.json();
    setToast({
      status:true,
      msg:parsedRes[Object.keys(parsedRes)[0]],
      type:Object.keys(parsedRes)[0]
    })
    
  };

  const sendDataToParent = (data) => {
    setquestions((previousData) => [...previousData,data]);
  }
  
  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Create New Exam
      </Typography>
  
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* Name Field */}
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            value={name}
            onChange={handleChange}
            required
            fullWidth
          />

          <div>
            { toast.status && <Toast message={toast.msg} type={toast.type} /> }
            {
              questions.map(i => {
                return (
                  <ol key={i.question}>
                    <li>Heading = {i.heading} </li>
                    <li>Description = {i.statement}</li>
                  <ul>
                    <ol>
                    {
                      i.testcases.map((testCase,index) => {
                        return (
                          <>
                            <li>Testcase {index+1}</li>
                            <ul>
                              <li>Input = {testCase.input}</li>
                              <li>Output = {testCase.output}</li>
                            </ul>
                          </>
                        )
                      })
                    }
                    </ol>
                  </ul>
                  </ol>
                )
              })
            }
            <Button variant="contained" onClick={() => {setModal(true) }}>
              Add questions
            </Button>
            { modal && <Modal1 sendDataToParent={sendDataToParent} enableModal={setModal}/> }
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
            Submit
          </Button>
        </Box>

    </Container>
  );
};

export default Form;
