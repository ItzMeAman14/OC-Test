import React, { useState, useEffect, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, Select, MenuItem, Divider } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import ExamCompletion from "./ExamCompletion";

function ExamDetail() {
  const navigate = useNavigate();
  const { exam_id } = useParams();

  // States
  const [lang, setLang] = useState('python3');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [allOutput, setAllOutput] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [question, setQuestion] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [completed, setCompleted] = useState(false);

  // Timer
  const [time, setTime] = useState(3600);

  // For Scores
  const [numOfSubmissions, setNumOfSubmissions] = useState(0);

  const [scoreUpdates,setScoreUpdates] = useState({});

  const executeCode = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/execute`, {
        method: "POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({
          input,
          lang,
          userInputs: userInput 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not OK');
      }

      const data = await response.json();
      setOutput(data.output || data.error);
    }
    catch (error) {
      console.error(error);
    }
  };

  const runAll = async () => {
    const out = [];
    setOutput("");
    setNumOfSubmissions(numOfSubmissions + 1);
    let passed = 0;
    
    for (let i of question.testcases) {
      let userInputEach = i.input;

      try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/execute`, {
          method: "POST",
          headers:{
            "Content-Type":"application/json",
          },
          body: JSON.stringify({
            input,
            lang,
            "userInputs": userInputEach
          }),
        });
        let outputResponse = await response.json();

        if (!outputResponse.ok) {
          console.error(outputResponse.error);
        }

        if (i.output !== outputResponse.output) {
          out.push({ "icon": "fa-solid fa-face-sad-tear", "color": "red" });
        } else {
          passed++;
          out.push({ "icon": "fa-solid fa-face-smile", "color": "green" });
        }
      }
      catch (err) {
        console.error(err);
      }
    } 

    // Setting TestCases Passed
    setScoreUpdates(prevState => ({
      ...prevState,
      [question._id]: passed
    }));

    if(question.testcases.length === passed){
        passQuestion(question._id);
    }
    setAllOutput(out);
  };

  const passQuestion = async(id) => {
      try{
        const token = Cookies.get("tokenUser");
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/passQuestion/${id}`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
            "userAPIKEY":token
          },
        })

        const parsed = await res.json();
        if(res.ok){
          setTimeout(() => {
            getAllQuestions();
            setInput('');
            setOutput('')
            setAllOutput([]);
            setUserInput('')
          },3000);
          toast.success(parsed.message, {
            autoClose: 5000,
            hideProgressBar: false,
            pauseOnHover: true,
            closeButton: false,
          });
        }
        else{
          toast.error(parsed.message, {
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

  const getAllQuestions = useCallback(async () => {
    try {
      const token = Cookies.get("tokenUser");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getExam/${exam_id}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "userAPIKEY":token
        }
      });
      const parsed = await res.json();

      let passedQuestion = 0;
      parsed[0].questions.forEach(ques => {
          if(ques.passed){
            passedQuestion++;
          }
      });

      if(passedQuestion === parsed[0].questions.length){
        setTimeout(() => {
          setCompleted(true);
        },3000)
      }
      
      setQuestions(parsed[0].questions);
      
      for(let i=0;i<parsed[0].questions.length;i++){
        if(!parsed[0].questions[i].passed){
          setQuestion(parsed[0].questions[i]);
          break;
        }
      }
      
    } catch (err) {
      console.error(err);
    }
  }, [exam_id]);

  const filterData = (idtoFilter) => {
    const ques = questions.filter(ques => ques._id === idtoFilter);
    setQuestion(ques[0]);
  };


  const formatTimer = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);  
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  

  const updateTotalTestCases = () => {
    let testCases = 0;
    questions.forEach(ques => {
        testCases += ques.testcases.length;
    });
    return testCases;
  }

  const setScores = async() => {    
    try{
      let sumOfPassedTestCases = Object.values(scoreUpdates).reduce((acc,currentVal) => acc + currentVal, 0);
      let givenTime = Math.floor(3600/60); // in minutes
      let timeTaken = Math.floor((3600 - time)/60);  // in minutes
      let totalTestCases = updateTotalTestCases();

      const uid = Cookies.get("uid");
      const token = Cookies.get("tokenUser");
      
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/setuserScores/${exam_id}?user_id=${uid}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          "userAPIKEY":token
        },
        body:JSON.stringify({
          testCasesPassed:sumOfPassedTestCases,
          totalTestCases,
          timeTaken,
          givenTime,
          numOfSubmissions
        })
      })

      const parsed = await res.json();
      if(!res.ok){
        console.log(parsed.message);
      }
    }
    catch(err){
      console.error(err);
    }
  }


  const submitExam = useCallback(async() => {
    try{
      const token = Cookies.get("tokenUser");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/completeExam/${exam_id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          "userAPIKEY":token
        },
      });

      const parsed = await res.json();
      if(res.ok){
        getAllQuestions();
        setScores();
        toast.success(parsed.message, {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
      else{
        toast.error(parsed.message, {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
      navigate(`/score/${exam_id}`);
    }
    catch(err){
      console.error(err);
    }
  },[exam_id])

  useEffect(() => {
    let timer;
    
    if (time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);  
    } else if (time === 0) {
      submitExam();
    }

    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    getAllQuestions();
  }, [getAllQuestions]);

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: 'black' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: "row" }}>

          {/* Timer in the middle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <Typography variant="h6" sx={{ color: '#FF2626', fontSize: '1.2rem' }}>
              Timer: {formatTimer(time)}
            </Typography>
          </Box>

          {/* Right Side Button */}
          <Button variant='contained' style={{ backgroundColor: "#FF2626", width: "200px" }} onClick={submitExam}>
            Submit Exam
          </Button>
        </Toolbar>
      </AppBar>


      {
        !completed &&

      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
        {
          questions.map((question, index) => (
            question.passed ?

              <Button
                key={question._id}
                variant="text"
                disabled
                sx={{
                  textTransform: 'none',
                  borderBottom: '2px solid transparent',
                  '&:hover': {
                    borderBottom: '2px solid rgb(25, 0, 255)',
                  },
                }}
              >
                {index + 1}
              </Button>

              :

            <Button
              key={question._id}
              variant="text"
              onClick={() => filterData(question._id)}
            >
              {index + 1}
            </Button>
          ))
        }
      </Box>

      }

      {
        completed ?
        
        <ExamCompletion />

        :

      <div className="wrapper" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '85vh' }}>
        {/* Question Box */}
        <Box className="question-box" sx={{ flex: 1.5, backgroundColor: '#f0f0f0', padding: 2, height: '100%' }}>
          <Typography variant="h6" className="question-heading">
            {question.heading}
          </Typography>
          <Typography variant="body1" className="question-desc" sx={{ marginBottom: 2 }}>
            {question.statement}
          </Typography>
        </Box>

        {/* Input Box */}
        <Box sx={{ flex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Lang Select inside Input Box */}
          <Select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            fullWidth
          >
            <MenuItem value="python3">Python 3</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
          </Select>

          <TextField
            fullWidth
            multiline
            minRows={19}
            variant="outlined"
            placeholder="Write your code here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ flex: 1,overflow:"scroll"}}
          />

        </Box>

        {/* Output Box */}
        <Box className="fourth-box" sx={{ flex: 1, backgroundColor: '#cfcfcf', padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Output Heading */}
          <Typography variant="h6" className="output-heading" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Output
          </Typography>

          {/* User Input Box */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter custom inputs"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          {/* Buttons inside Output Box */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
            <Button onClick={executeCode} variant="contained" sx={{ margin: 1 }}>
              <i className="fa-solid fa-play" />
              custom run
            </Button>
            <Button onClick={runAll} variant="contained" sx={{ margin: 1 }}>
              Submit
            </Button>
          </Box>

          <Divider />

          {/* Display Icons for each output */}
          <Box className="container-fluid" sx={{ marginTop: 3 }}>
            <Box className="row row-cols-1 row-cols-md-3 g-4">
              {
                output
              }
              {allOutput && allOutput.map((item, index) => (
                <Box key={index} className="col" sx={{ textAlign: 'center' }}>
                  <i
                    className={`${item.icon}`}
                    style={{
                      color: item.color,
                      fontSize: 40,
                      padding: 20,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </div>
      }
    </>
  );
}

export default ExamDetail;
