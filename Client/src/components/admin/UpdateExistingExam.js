import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Paper,
  Stack,
} from "@mui/material"
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import Cookies from "js-cookie";
import { useToast } from '../context/ToastContext'; 

export default function UpdateExistingExam() {
  const { showSuccess, showError } = useToast();
  const [exams, setExams] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [currentExamId, setCurrentExamId] = useState(null)
  const [currentQuestionId, setCurrentQuestionId] = useState(null)
  const [editMode, setEditMode] = useState(null)
  const [formData, setFormData] = useState({
    examName: "",
    questionHeading: "",
    questionStatement: "",
    testcases: [],
    newTestcaseInput: "",
    newTestcaseOutput: "",
  })

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    type: "",
    id: null,
  })

  const [addQuestionDialog, setAddQuestionDialog] = useState({
    open: false,
    examId: null,
  })

  const handleUpdateExamName = (exam) => {
    setCurrentExamId(exam._id)
    setFormData({
      ...formData,
      examName: exam.name,
    })
    setEditMode("exam")
    setOpenDialog(true)
  }

  const handleUpdateQuestion = (exam, question) => {
    setCurrentExamId(exam)
    setCurrentQuestionId(question._id)
    setFormData({
      ...formData,
      questionHeading: question.heading,
      questionStatement: question.statement,
      testcases: [...question.testcases],
      newTestcaseInput: "",
      newTestcaseOutput: "",
    })
    setEditMode("question")
    setOpenDialog(true)
  }

  const handleAddQuestion = (examId) => {
    setAddQuestionDialog({
      open: true,
      examId,
    })
    setFormData({
      ...formData,
      questionHeading: "",
      questionStatement: "",
      testcases: [],
      newTestcaseInput: "",
      newTestcaseOutput: "",
    })
  }

  const handleDeleteExam = (examId) => {
    setDeleteConfirmDialog({
      open: true,
      type: "exam",
      id: examId,
    })
  }

  const handleDeleteQuestion = (questionId) => {
    setDeleteConfirmDialog({
      open: true,
      type: "question",
      id: questionId,
    })
  }

  const confirmDelete = async () => {
    if (deleteConfirmDialog.type === "exam") {
      try{
        const token = Cookies.get("tokenAdmin");
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/deleteExam/${deleteConfirmDialog.id}`,{
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            "userAPIKEY":token
          },
        })
        const data = await res.json();
        if(res.ok){
          showSuccess(data.message)
          getAllExams();
        }
        else{
          showError(data.message)
        }
      }
      catch(err){
        console.error(err);
      }
      
    } else if (deleteConfirmDialog.type === "question") {
      try{
        const token = Cookies.get("tokenAdmin");
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/deleteQuestion/${deleteConfirmDialog.id}`,{
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            "userAPIKEY":token
          },
        })
  
        const data = await res.json();
        if(res.ok){
          showSuccess(data.message);
          getAllExams();
        }
        else{
          showError("Some Error Occured");
        }
      }
      catch(err){
        console.error(err);
      }
    }
    setDeleteConfirmDialog({ open: false, type: "", id: null })
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditMode(null)
    setCurrentExamId(null)
    setCurrentQuestionId(null)
  }

  const handleCloseAddQuestionDialog = () => {
    setAddQuestionDialog({
      open: false,
      examId: null,
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddTestcase = () => {
    if (formData.newTestcaseInput && formData.newTestcaseOutput) {
      setFormData({
        ...formData,
        testcases: [
          ...formData.testcases,
          {
            input: formData.newTestcaseInput,
            output: formData.newTestcaseOutput,
          },
        ],
        newTestcaseInput: "",
        newTestcaseOutput: "",
      })
    }
  }

  const handleRemoveTestcase = (index) => {
    const updatedTestcases = [...formData.testcases]
    updatedTestcases.splice(index, 1)
    setFormData({
      ...formData,
      testcases: updatedTestcases,
    })
  }

  const handleSave = async () => {
    if (editMode === "exam" && currentExamId) {
      try{
        const token = Cookies.get("tokenAdmin");
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/updateExamName/${currentExamId}`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
            "userAPIKEY":token
          },
          body:JSON.stringify({
            name:formData.examName
          })
        })
        const data = await res.json();
        if(res.ok){
          showSuccess(data.message)
          getAllExams();
        }
        else{
          showError(data.message)
        }
      }
      catch(err){
      console.error(err);
      }
    } else if (editMode === "question" && currentExamId && currentQuestionId) {
      try{
        const token = Cookies.get("tokenAdmin");
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/updateQuestion/${currentQuestionId}`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
            "userAPIKEY":token
          },
          body:JSON.stringify({
            question:{
              heading:formData.questionHeading,
              statement:formData.questionStatement
            },
            testCases:formData.testcases
          })
        })
  
        const parsed = await res.json();
        if(res.ok){
          getAllExams();
          showSuccess(parsed.message)
        }
        else{
          showError("Some Error Occured")
        }
  
      }
      catch(err){
        console.error(err);
      }
    }
    handleCloseDialog()
  }

  const handleSaveNewQuestion = async () => {
    // Validate form
    if (!formData.questionHeading || !formData.questionStatement || formData.testcases.length === 0) {
      alert("Please fill all fields and add at least one test case")
      return
    }

    const newQuestion = {
      heading: formData.questionHeading,
      statement: formData.questionStatement,
      testcases: formData.testcases,
    }

    try{
      const token = Cookies.get("tokenAdmin");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/createQuestion/${addQuestionDialog.examId}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "userAPIKEY":token
        },
        body:JSON.stringify({
          question: newQuestion
        })
      })

      const data = await res.json();
      if(res.ok){
        showSuccess(data.message);
        getAllExams();
      }
      else{
        showError(data.message);
      }
    }
    catch(err){
      console.error(err);
    }

    handleCloseAddQuestionDialog()
  }


  
    const getAllExams = async() => {
      try{
        const token = Cookies.get("tokenAdmin");
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getAllExams`,{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            "userAPIKEY":token
          },
        });
        const data = await res.json();      
        setExams(data);
  
      }
      catch(err){
        console.error(err);
      }
    }


    useEffect(() => {
      getAllExams();
    },[]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: "#333333" }}>
        Update Existing Exams
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: "#555555" }}>
        Total Exams: {exams.length}
      </Typography>

      {exams.map((exam) => (
        <Accordion key={exam._id} sx={{ mb: 2, bgcolor: "#f8f8f8", border: "1px solid #e0e0e0" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#555555" }} />}>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Typography sx={{ flexGrow: 1, color: "#333333" }}>{exam.name}</Typography>
              <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUpdateExamName(exam)
                  }}
                  sx={{
                    borderColor: "#333333",
                    color: "#333333",
                    "&:hover": {
                      borderColor: "#555555",
                      backgroundColor: "rgba(85, 85, 85, 0.04)",
                    },
                  }}
                >
                  Update Exam Name
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteExam(exam._id)
                  }}
                  sx={{
                    borderColor: "#d32f2f",
                    color: "#d32f2f",
                    "&:hover": {
                      borderColor: "#b71c1c",
                      backgroundColor: "rgba(211, 47, 47, 0.04)",
                    },
                  }}
                >
                  Delete Exam
                </Button>
              </Stack>
              <Typography variant="body2" sx={{ color: "#555555" }}>
                {exam.questions.length} Questions
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleAddQuestion(exam._id)}
                sx={{
                  bgcolor: "#333333",
                  "&:hover": {
                    bgcolor: "#555555",
                  },
                }}
              >
                Add Question
              </Button>
            </Box>
            <List>
              {exam.questions.map((question) => (
                <Paper key={question._id} sx={{ mb: 2, p: 2, bgcolor: "white" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ color: "#333333" }}>
                        {question.heading}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, mb: 2, color: "#555555" }}>
                        {question.statement}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: "#555555" }}>
                        Test Cases: {question.testcases.length}
                      </Typography>
                      <List dense>
                        {question.testcases.map((testcase) => (
                          <ListItem key={testcase._id}>
                            <ListItemText
                              primary={`Input: ${testcase.input}`}
                              secondary={`Output: ${testcase.output}`}
                              primaryTypographyProps={{ color: "#333333" }}
                              secondaryTypographyProps={{ color: "#555555" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleUpdateQuestion(exam, question)}
                        sx={{
                          bgcolor: "#333333",
                          "&:hover": {
                            bgcolor: "#555555",
                          },
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              ))}
              {exam.questions.length === 0 && (
                <Typography sx={{ textAlign: "center", color: "#777777", py: 2 }}>
                  No questions in this exam. Click "Add Question" to create one.
                </Typography>
              )}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Dialog for updating exam or question */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#333333" }}>
          {editMode === "exam" ? "Update Exam" : editMode === "question" ? "Update Question" : ""}
        </DialogTitle>
        <DialogContent>
          {editMode === "exam" && (
            <TextField
              fullWidth
              label="Exam Name"
              name="examName"
              value={formData.examName}
              onChange={handleChange}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#aaaaaa",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#555555",
                  },
                },
              }}
            />
          )}

          {editMode === "question" && (
            <>
              <TextField
                fullWidth
                label="Question Heading"
                name="questionHeading"
                value={formData.questionHeading}
                onChange={handleChange}
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#aaaaaa",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#555555",
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Question Statement"
                name="questionStatement"
                value={formData.questionStatement}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#aaaaaa",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#555555",
                    },
                  },
                }}
              />

              <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#333333" }}>
                Test Cases
              </Typography>
              <List>
                {formData.testcases.map((testcase, index) => (
                  <ListItem
                    key={testcase._id}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTestcase(index)}>
                        <DeleteIcon sx={{ color: "#d32f2f" }} />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`Input: ${testcase.input}`}
                      secondary={`Output: ${testcase.output}`}
                      primaryTypographyProps={{ color: "#333333" }}
                      secondaryTypographyProps={{ color: "#555555" }}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ color: "#333333" }}>
                Add New Test Case
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TextField
                  label="Input"
                  name="newTestcaseInput"
                  value={formData.newTestcaseInput}
                  onChange={handleChange}
                  sx={{
                    mr: 1,
                    flexGrow: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#aaaaaa",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#555555",
                      },
                    },
                  }}
                />
                <TextField
                  label="Output"
                  name="newTestcaseOutput"
                  value={formData.newTestcaseOutput}
                  onChange={handleChange}
                  sx={{
                    mr: 1,
                    flexGrow: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#aaaaaa",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#555555",
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddTestcase}
                  sx={{
                    bgcolor: "#333333",
                    "&:hover": {
                      bgcolor: "#555555",
                    },
                  }}
                >
                  Add
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: "#555555" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              bgcolor: "#333333",
              "&:hover": {
                bgcolor: "#555555",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding a new question */}
      <Dialog open={addQuestionDialog.open} onClose={handleCloseAddQuestionDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "#333333" }}>Add New Question</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question Heading"
            name="questionHeading"
            value={formData.questionHeading}
            onChange={handleChange}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#aaaaaa",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#555555",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Question Statement"
            name="questionStatement"
            value={formData.questionStatement}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#aaaaaa",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#555555",
                },
              },
            }}
          />

          <Typography variant="h6" sx={{ mt: 3, mb: 1, color: "#333333" }}>
            Test Cases
          </Typography>
          {formData.testcases.length > 0 ? (
            <List>
              {formData.testcases.map((testcase, index) => (
                <ListItem
                  key={testcase._id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTestcase(index)}>
                      <DeleteIcon sx={{ color: "#d32f2f" }} />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`Input: ${testcase.input}`}
                    secondary={`Output: ${testcase.output}`}
                    primaryTypographyProps={{ color: "#333333" }}
                    secondaryTypographyProps={{ color: "#555555" }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ color: "#777777", my: 1 }}>
              No test cases added yet. Add at least one test case below.
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ color: "#333333" }}>
            Add Test Case
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <TextField
              label="Input"
              name="newTestcaseInput"
              value={formData.newTestcaseInput}
              onChange={handleChange}
              sx={{
                mr: 1,
                flexGrow: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#aaaaaa",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#555555",
                  },
                },
              }}
            />
            <TextField
              label="Output"
              name="newTestcaseOutput"
              value={formData.newTestcaseOutput}
              onChange={handleChange}
              sx={{
                mr: 1,
                flexGrow: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#aaaaaa",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#555555",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTestcase}
              sx={{
                bgcolor: "#333333",
                "&:hover": {
                  bgcolor: "#555555",
                },
              }}
            >
              Add
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddQuestionDialog} sx={{ color: "#555555" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveNewQuestion}
            variant="contained"
            sx={{
              bgcolor: "#333333",
              "&:hover": {
                bgcolor: "#555555",
              },
            }}
          >
            Save Question
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog for deleting exam or question */}
      <Dialog
        open={deleteConfirmDialog.open}
        onClose={() => setDeleteConfirmDialog({ open: false, type: "", id: null })}
      >
        <DialogTitle sx={{ color: "#d32f2f" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#333333" }}>
            {deleteConfirmDialog.type === "exam"
              ? "Are you sure you want to delete this exam? This action cannot be undone."
              : "Are you sure you want to delete this question? This action cannot be undone."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog({ open: false, type: "", id: null })} sx={{ color: "#555555" }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}