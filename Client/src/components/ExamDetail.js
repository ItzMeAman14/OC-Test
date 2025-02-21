import React, { useState, useEffect, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, Select, MenuItem, Divider } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ExamDetail() {
  const navigate = useNavigate();
  const { exam_id } = useParams();
  const [lang, setLang] = useState('python3');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [allOutput, setAllOutput] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [question, setQuestion] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [time, setTime] = useState(3600);

  const executeCode = async () => {
    try {
      const response = await fetch('http://localhost:7123/execute', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
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

    let passed = 0;
    for (let i of question.testcases) {
      let userInputEach = i.input;

      try {
        let response = await fetch('http://localhost:7123/execute', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input,
            lang,
            "userInputs": userInputEach
          }),
        });
        let outputResponse = await response.json();

        if (!outputResponse.ok) {
          console.log(outputResponse.error);
          console.log("Some error occurred");
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
    if(question.testcases.length === passed){
        passQuestion(question._id);
        getAllQuestions();
    }
    setAllOutput(out);
  };

  const passQuestion = async(id) => {
      try{
        const res = await fetch(`http://localhost:7123/passQuestion/${id}`,{
          method:"PUT"
        })

        const parsed = await res.json();
        if(res.ok){
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
      const res = await fetch(`http://localhost:7123/getExam/${exam_id}`);
      const parsed = await res.json();
      setQuestions(parsed[0].questions);
      setQuestion(parsed[0].questions[0]);
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
  


  const submitExam = () => {
    console.log(3600 - time);
    
    navigate(`/score?${exam_id}`)
  }

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
    </>
  );
}

export default ExamDetail;
