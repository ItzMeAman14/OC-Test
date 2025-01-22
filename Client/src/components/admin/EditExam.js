import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, TextField } from '@mui/material';

// Sample data for exams and questions
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
  // State to track which exam's questions are visible
  const [showQuestions, setShowQuestions] = useState({});

  // Toggle visibility of questions for a specific exam
  const handleToggleQuestions = (examId) => {
    setShowQuestions((prevState) => ({
      ...prevState,
      [examId]: !prevState[examId]
    }));
  };

  const handleQuestionChange = (examId, questionId, newStatement) => {
    const updatedExams = exams.map((exam) => {
      if (exam._id === examId) {
        return {
          ...exam,
          questions: exam.questions.map((question) => {
            if (question.id === questionId) {
              return {
                ...question,
                statement: newStatement
              };
            }
            return question;
          })
        };
      }
      return exam;
    });
    console.log(updatedExams);
  };

  return (
    <div>
      {/* Map through each exam */}
      {exams.map((exam) => (
        <Box key={exam._id} sx={{ marginBottom: '30px' }}>
          {/* Card for the exam */}
          <Card sx={{ maxWidth: "100vw", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {exam.name}
              </Typography>

              {/* Button to toggle questions visibility */}
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
                            Question: {question.statement}
                          </Typography>

                         
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Number of Test Cases: {question.testcases.length}
                          </Typography>

                          
                          <TextField
                            fullWidth
                            multiline
                            variant="outlined"
                            label="Edit Question"
                            value={question.statement}
                            onChange={(e) =>
                              handleQuestionChange(exam._id, question.id, e.target.value)
                            }
                            sx={{ marginBottom: '10px' }}
                          />
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
