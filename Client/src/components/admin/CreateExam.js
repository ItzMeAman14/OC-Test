"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material"
import Cookies from "js-cookie";

export default function CreateExam() {
  const [activeStep, setActiveStep] = useState(0)
  const [examName, setExamName] = useState("")
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState({
    heading: "",
    statement: "",
    testcases: [],
  })
  const [newTestcase, setNewTestcase] = useState({
    input: "",
    output: "",
  })
  const [examNameError, setExamNameError] = useState(false)
  const [questionError, setQuestionError] = useState({
    heading: false,
    statement: false,
  })
  const [openDialog, setOpenDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const steps = ["Exam Details", "Add Questions", "Review & Submit"]

  const handleNext = () => {
    if (activeStep === 0) {
      if (!examName.trim()) {
        setExamNameError(true)
        return
      }
      setActiveStep((prevStep) => prevStep + 1)
    } else if (activeStep === 1) {
      if (questions.length === 0) {
        setOpenDialog(true)
        return
      }
      setActiveStep((prevStep) => prevStep + 1)
    } else if (activeStep === 2) {
      handleSubmitExam()
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleExamNameChange = (e) => {
    setExamName(e.target.value)
    setExamNameError(false)
  }

  const handleQuestionChange = (e, field) => {
    setCurrentQuestion({
      ...currentQuestion,
      [field]: e.target.value,
    })
    if (field === "heading" || field === "statement") {
      setQuestionError({
        ...questionError,
        [field]: false,
      })
    }
  }

  const handleTestcaseChange = (e, field) => {
    setNewTestcase({
      ...newTestcase,
      [field]: e.target.value,
    })
  }

  const addTestcase = () => {
    if (newTestcase.input.trim() && newTestcase.output.trim()) {
      setCurrentQuestion({
        ...currentQuestion,
        testcases: [...currentQuestion.testcases, { ...newTestcase }],
      })
      setNewTestcase({ input: "", output: "" })
    }
  }

  const removeTestcase = (index) => {
    const updatedTestcases = [...currentQuestion.testcases]
    updatedTestcases.splice(index, 1)
    setCurrentQuestion({
      ...currentQuestion,
      testcases: updatedTestcases,
    })
  }

  const addQuestion = () => {
    const errors = {
      heading: !currentQuestion.heading.trim(),
      statement: !currentQuestion.statement.trim(),
    }

    setQuestionError(errors)

    if (errors.heading || errors.statement) {
      return
    }

    if (currentQuestion.testcases.length === 0) {
      setSnackbar({
        open: true,
        message: "Please add at least one test case",
        severity: "error",
      })
      return
    }

    setQuestions([...questions, { ...currentQuestion }])
    setCurrentQuestion({
      heading: "",
      statement: "",
      testcases: [],
    })
  }

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleSubmitExam = async () => {
    
    const token = Cookies.get("tokenAdmin");

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/createExam`,{
      "method":"POST",
      headers:{
        "Content-Type":"application/json",
        "userAPIKEY":token
      },
      body:JSON.stringify({
        name: examName,
        questions
      })
    })

    const parsed = await response.json();

    if(response.ok){

      setSnackbar({
        open: true,
        message: parsed.message,
        severity: "success",
      })
    }
    else{
      setSnackbar({
        open: true,
        message: "Some Error Occured",
        severity: "error",
      })
    }

    setExamName("")
    setQuestions([])
    setCurrentQuestion({
      heading: "",
      statement: "",
      testcases: [],
    })
    setActiveStep(0)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  const continueWithoutQuestions = () => {
    setOpenDialog(false)
    setActiveStep(2)
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Exam
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={3} sx={{ p: 3 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Exam Details
            </Typography>
            <TextField
              fullWidth
              label="Exam Name"
              value={examName}
              onChange={handleExamNameChange}
              error={examNameError}
              helperText={examNameError ? "Exam name is required" : ""}
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add Questions
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <TextField
                  fullWidth
                  label="Question Heading"
                  value={currentQuestion.heading}
                  onChange={(e) => handleQuestionChange(e, "heading")}
                  error={questionError.heading}
                  helperText={questionError.heading ? "Heading is required" : ""}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Question Statement"
                  value={currentQuestion.statement}
                  onChange={(e) => handleQuestionChange(e, "statement")}
                  error={questionError.statement}
                  helperText={questionError.statement ? "Statement is required" : ""}
                  multiline
                  rows={4}
                  sx={{ mb: 3 }}
                />

                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Test Cases
                </Typography>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <TextField
                    label="Input"
                    value={newTestcase.input}
                    onChange={(e) => handleTestcaseChange(e, "input")}
                    sx={{ mr: 1, flexGrow: 1 }}
                  />
                  <TextField
                    label="Output"
                    value={newTestcase.output}
                    onChange={(e) => handleTestcaseChange(e, "output")}
                    sx={{ mr: 1, flexGrow: 1 }}
                  />
                  <Button variant="contained" color="primary" onClick={addTestcase} startIcon={<AddIcon />}>
                    Add
                  </Button>
                </Box>

                {currentQuestion.testcases.length > 0 && (
                  <List>
                    {currentQuestion.testcases.map((testcase, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => removeTestcase(index)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={`Input: ${testcase.input}`} secondary={`Output: ${testcase.output}`} />
                      </ListItem>
                    ))}
                  </List>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={addQuestion}
                  startIcon={<SaveIcon />}
                  sx={{ mt: 2 }}
                >
                  Save Question
                </Button>
              </CardContent>
            </Card>

            {questions.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Questions Added: {questions.length}
                </Typography>
                <List>
                  {questions.map((question, index) => (
                    <Paper key={index} sx={{ mb: 2, p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            {index + 1}. {question.heading}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {question.statement}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Test Cases: {question.testcases.length}
                          </Typography>
                        </Box>
                        <IconButton color="error" onClick={() => removeQuestion(question.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Review Exam
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Exam Name: {examName}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Total Questions: {questions.length}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {questions.map((question, index) => (
              <Paper key={question.id} sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Question {index + 1}: {question.heading}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {question.statement}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Test Cases:
                </Typography>
                <List dense>
                  {question.testcases.map((testcase, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={`Input: ${testcase.input}`} secondary={`Output: ${testcase.output}`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>No Questions Added</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You haven't added any questions to this exam. Do you want to continue to the review page anyway?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Go Back</Button>
          <Button onClick={continueWithoutQuestions} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}