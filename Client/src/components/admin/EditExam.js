import React, { useState,useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Button, Box, Stack, TextField } from '@mui/material';
import { Edit, Delete, ChangeCircle } from '@mui/icons-material';
import ModalExam from './ModalExam';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal1 from '../Modal1';


const EditExams = () => {
  const [showQuestions, setShowQuestions] = useState({});
  const [examModal,setExamModal] = useState({status:false,question_id:null});
  const [exams, setExams] = useState([]);
  const [modal, setModal] = useState({status:false,exam_id:null});
  const [toggleUpdateButton, setToggleUpdateButton] = useState([]);
  const [examname, setExamName] = useState('');


  const handleToggleQuestions = (examId) => {
    setShowQuestions((prevState) => ({
      ...prevState,
      [examId]: !prevState[examId]
    }));
  };


  const addQuestion = async (question) => {
    try{
      const res = await fetch(`http://localhost:7123/createQuestion/${question.exam_id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          question
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
        getAllExams();
      }
      else{
        toast.error(data.message, {
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

  const deleteQuestion = async (id) => {
    try{
      const res = await fetch(`http://localhost:7123/deleteQuestion/${id}`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        }
      })

      const data = await res.json();
      if(res.ok){
        toast.success(data.message, {
          autoClose: 5000, 
          hideProgressBar: false, 
          pauseOnHover: true,
          closeButton: false,
        });
        getAllExams();
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

  const getAllExams = async() => {
    try{
      const res = await fetch("http://localhost:7123/getAllExams");
      const data = await res.json();      
      setExams(data);
      setExamName(data[0].name)
      
      // Setting the exam data for changing name
      let temp_data = [];
      data.map((element) => {
        let exam_object = {
          id:element._id,
          status:false,
          name:element.name
        }
        temp_data.push(exam_object);
      })

      setToggleUpdateButton(temp_data);

    }
    catch(err){
      console.error(err);
    }
  }

  const deleteExam = async(id) => {
    try{
      const res = await fetch(`http://localhost:7123/deleteExam/${id}`,{
        method:"DELETE"
      })
      const data = await res.json();
      if(res.ok){
        toast.success(data.message, {
          autoClose: 5000, 
          hideProgressBar: false, 
          pauseOnHover: true,
          closeButton: false,
        })
        getAllExams();
      }
      else{
        toast.error(data.message,{
          autoClose: 5000, 
          hideProgressBar: false, 
          pauseOnHover: true,
          closeButton: false
        })
      }
    }
    catch(err){
      console.error(err);
    }
  }

  const updateExamName = async(id) => {
     try{
        // const res = await fetch(`http://localhost:7123/updateExam/${id}`)
        // const data = await res.json();
        // if(res.ok){
        //   toast.success(data.message, {
        //     autoClose: 5000, 
        //     hideProgressBar: false, 
        //     pauseOnHover: true,
        //     closeButton: false,
        //   })
        //   getAllExams();
        // }
        // else{
        //   toast.error(data.message,{
        //     autoClose: 5000, 
        //     hideProgressBar: false, 
        //     pauseOnHover: true,
        //     closeButton: false
        //   })
        // }
        setToggleUpdateButton(false);
     }
     catch(err){
      console.error(err);
     }
  }

  useEffect(() => {
    getAllExams();
    console.log(toggleUpdateButton);
    
  }, [examModal.status]);

  return (
    <div>
  
      {exams.map((exam,index) => (
        <Box key={exam._id} sx={{ marginBottom: '30px' }}>

          {/* Add Question Modal */}
          { modal.status && <Modal1 sendDataToParent={addQuestion} enableModal={setModal}  exam_id={modal.exam_id}/> }

          <ToastContainer />
          {/* Exam Update Modal */}
          { examModal.status && <ModalExam enableModal={setExamModal} question_id={examModal.question_id}/> }

          <Card sx={{ maxWidth: "100vw", boxShadow: 3 }}>
            <CardContent>
              
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              
              {
                !toggleUpdateButton[index].status ?
                <Typography variant="h5" component="div" gutterBottom>
                {exam.name}
              </Typography>
              :
              
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={examname}
                onChange={ (e) => { setExamName(e.target.value) }}
              />
            }

              <Stack direction="row" spacing={2} alignItems="center"> 
                
                {
                  !toggleUpdateButton[index].status ?
                  <Button 
                      variant="contained" 
                      onClick={() => { setToggleUpdateButton([...toggleUpdateButton]) }} 
                      startIcon={<Edit />} 
                      style={{ backgroundColor: "#0566dc", width: "200px" }}
                    >
                      Update Name
                  </Button>
                      :
                  <Button 
                      variant="contained" 
                      onClick={ () => { updateExamName(exam._id) }} 
                      startIcon={<ChangeCircle />} 
                      style={{ backgroundColor: "#0566dc", width: "200px" }}
                    >
                      Change Name
                  </Button>
                }

                <Button 
                  variant="contained" 
                  onClick={() => { deleteExam(exam._id) }} 
                  startIcon={<Delete />} 
                  style={{ backgroundColor: "#FF2626", width: "200px" }}
                >
                  DELETE EXAM
                </Button>
              </Stack>
            </Box>


              
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleToggleQuestions(exam._id)}
                sx={{ marginBottom: '20px' }}
              >
                {showQuestions[exam._id] ? 'Hide Questions' : 'Show Questions'}
              </Button>

              <Button variant='contained' style={{width:200,height:50,margin:4}} onClick={() => { setModal({status:true,exam_id:exam._id}) }}>Add Question</Button>
              <Typography variant='body3' sx={{margin:4}}>
                Number of Questions: {exam.questions.length}
              </Typography>
              {showQuestions[exam._id] && (
                <Grid container spacing={3}>


                  {exam.questions.map((question) => (
                    <Grid item xs={12} sm={6} md={4} key={question._id}>
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
                          <Button variant="contained" startIcon={<Edit />} onClick={() => {setExamModal({status:true,question_id:question._id})}}>
                            Edit
                          </Button>

                          <Button variant="contained" style={{backgroundColor:"#FF2626"}} startIcon={<Delete />} onClick={() => { deleteQuestion(question._id) }}>
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
