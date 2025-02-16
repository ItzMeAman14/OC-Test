import React, { useState,useEffect,useCallback } from 'react';
import { Modal, Box, TextField, Button, Typography, Stack } from '@mui/material';
import { toast } from "react-toastify";

function ModalExam(props) {
  const [question, setQuestion] = useState([]); 
  const [testCases, setTestCases] = useState([]);

  const handleClose = () => {
    props.enableModal({status:false});
  }

  
  const updateTestCases = (e,index,type) => {
    if(type === "input"){
        const updatedTestCases = [...testCases]; 
        updatedTestCases[index] = {  
            ...testCases[index],  
            input: e.target.value,  
        };
        setTestCases(updatedTestCases);
    }
    else if(type === "output"){
        const updatedTestCases = [...testCases]; 
        updatedTestCases[index] = {  
            ...testCases[index],  
            output: e.target.value,  
        };
        setTestCases(updatedTestCases);
    }
  }

  const getQuestion = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:7123/getQuestion/${props.question_id}`);
      const data = await res.json();
      setQuestion(data[0].questions[0]);
      setTestCases(data[0].questions[0].testcases);
    } catch (err) {
      console.error(err);
    }
  }, [props.question_id])


  const updateQuestion = async () => {
    try{
      
      const res = await fetch(`http://localhost:7123/updateQuestion/${props.question_id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          question,
          testCases
        })
      })

      const parsed = await res.json();
      if(res.ok){
        toast.success(parsed.message,{
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false
        })
        props.enableModal({status:false})
      }
      else{
        toast.error("Some Error Occured", {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        })
      }

    }
    catch(err){
      console.error(err);
    }
  }

  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  return (
    <div>
      {/* Modal */}
      <Modal open={true} sx={{ overflow: 'auto' }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              xs: '90%', 
              sm: 500,   
            },
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '80vh', 
            overflowY: 'auto', 
          }}
        >
          {/* Modal Header */}
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Question
          </Typography>

          {/* Form */}

          <TextField
            label="Heading"
            variant="outlined"
            fullWidth
            value={question.heading}
            onChange={(e) => { setQuestion({...question,heading:e.target.value}) }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={question.statement}
            onChange={(e) => { setQuestion({...question,statement:e.target.value}) }}
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
                onChange={(e) => {updateTestCases(e,index,"input") }}
                sx={{ mb: 1 }}
                />
              <TextField
                label={`Output ${index + 1}`}
                variant="outlined"
                fullWidth
                value={testCase.output}
                onChange={(e) => {updateTestCases(e,index,"output") }}
                sx={{ mb: 2 }}
                />
                <Button variant='contained' color="error" sx={{"&:hover":{backgroundColor:"red"}}}>Delete TestCase {index+1}</Button>
            </Box> 
          ))}


          {/* Action buttons */}
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={updateQuestion}>
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default ModalExam;
