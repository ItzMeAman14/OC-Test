import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ModalExam from './ModalExam';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const exams = [
  {
    _id: "672dd5fbe4595b9610477549",
    name: "Allenhouse Y1 AIML",
    questions: [
      {
        statement: "Write a program to find factorial of a given integer n.",
        id: "672de9edf3263a7854d1387b",
        testcases: [
          { input: 5, output: 120 },
          { input: 0, output: 1 },
          { input: -1, output: -1 }
        ]
      },
      {
        statement: "This is the question 2.",
        id: "672dea38f3263a7854d1387c",
        testcases: ["To be done"]
      },
      {
        statement: "This is the question 3.",
        id: "672e0849f3263a7854d13880",
        testcases: ["To be done"]
      },
      {
        statement: "This is the question 4.",
        id: "672e0851f3263a7854d13882",
        testcases: ["To be done"]
      },
      {
        statement: "This is the question 5.",
        id: "672e0859f3263a7854d13884",
        testcases: ["To be done"]
      },
      {
        statement: "This is the question 6.",
        id: "672e085ff3263a7854d13886",
        testcases: ["To be done"]
      }
    ]
  },
  {
    _id: "672dd5fbe4595b9610477550",
    name: "Allenhouse Y2 AIML",
    questions: [
      {
        statement: "What is the difference between React and Angular?",
        id: "672de9edf3263a7854d1388c",
        testcases: [
          { input: "React", output: "Library" },
          { input: "Angular", output: "Framework" }
        ]
      },
      {
        statement: "Explain Redux in React.",
        id: "672dea38f3263a7854d13890",
        testcases: ["To be done"]
      }
    ]
  }
];

const EditExams = () => {
  const [showQuestions, setShowQuestions] = useState({});
  const [examModal,setExamModal] = useState({status:false,question_id:null});

  const handleToggleQuestions = (examId) => {
    setShowQuestions((prevState) => ({
      ...prevState,
      [examId]: !prevState[examId]
    }));
  };

  const deleteQuestion = async (id) => {
    try{
      const res = await fetch("http://localhost:7123/deleteQuestion",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          id
        })
      })

      const data = await res.json();
      if(res.ok){
        toast.success(data.message, {
          autoClose: 5000, 
          hideProgressBar: false, 
          pauseOnHover: true,
          closeButton: false,
        });
      }
      else{
        toast.error("Some Error Occured", {
          autoClose: 5000, 
          hideProgressBar: false, 
          pauseOnHover: true,
          closeButton: false,
        });
      }
    }
    catch(err){
      console.error(err);
    }
    
  }

  return (
    <div>
  
      {exams.map((exam) => (
        <Box key={exam._id} sx={{ marginBottom: '30px' }}>


          <ToastContainer />
          {/* Exam Update Modal */}
          { examModal.status && <ModalExam enableModal={setExamModal} question_id={examModal.question_id}/> }

          <Card sx={{ maxWidth: "100vw", boxShadow: 3 }}>
            <CardContent>
              
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" component="div" gutterBottom>
                {exam.name}
              </Typography>

              <Button variant="contained" startIcon={<Delete />} style={{ backgroundColor: "#FF2626",width:"200px" }}>
                DELETE EXAM
              </Button>
            </Box>

              
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleToggleQuestions(exam._id)}
                sx={{ marginBottom: '20px' }}
              >
                {showQuestions[exam._id] ? 'Hide Questions' : 'Show Questions'}
              </Button>

              {showQuestions[exam._id] && (
                <Grid container spacing={3}>
                  {exam.questions.map((question) => (
                    <Grid item xs={12} sm={6} md={4} key={question.id}>
                      <Card sx={{ maxWidth: 1000, boxShadow: 2 }}>
                        <CardContent>
                          <Typography variant="h6" component="div" gutterBottom>
                            Question: {question.statement.split("").filter((char,index) => {
                              return index<50
                            }).join("")}.....
                          </Typography>

                         
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Number of Test Cases: {question.testcases.length}
                          </Typography>

                          <Box display="flex" gap={2}>
                          <Button variant="contained" startIcon={<Edit />} onClick={() => {setExamModal({status:true,question_id:question.id})}}>
                            Edit
                          </Button>

                          <Button variant="contained" style={{backgroundColor:"#FF2626"}} startIcon={<Delete />} onClick={() => { deleteQuestion(question.id) }}>
                            Delete
                          </Button>
                        </Box>
                          
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Box>
      ))}
    </div>
  );
};

export default EditExams;
