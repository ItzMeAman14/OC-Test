import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, Select, MenuItem, Divider } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import ExamCompletion from "./ExamCompletion";
import WarningDialog from "../DialogBox/WarningDialog";
import DangerDialog from "../DialogBox/DangerDialog";
import { BallTriangle } from 'react-loader-spinner'
import handleKeyPress from './TextEditorFunctions/SpecialCharAutoComplete';

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

  // Secure Exam
  const [warning, setWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [danger, setDanger] = useState(false);

  // Timer
  const [time, setTime] = useState(3600);

  // For Scores
  const [numOfSubmissions, setNumOfSubmissions] = useState(0);
  const [scoreUpdates, setScoreUpdates] = useState({});

  // Loader
  const [loading, setLoading] = useState(false);

  // TextArea Number of Lines
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const getLineNumbers = (text) => {
    const lines = text.split('\n');
    return lines.map((_, index) => index + 1);
  };


  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);

      return () => {
        textarea.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);


  // Code Editor Functions
  const executeCode = async () => {
    try {
      setOutput('');
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      setLoading(false);
    }
    catch (error) {
      console.error(error);
    }
  };

  const runAll = async () => {
    const out = [];
    setOutput("");
    setAllOutput("");
    setNumOfSubmissions(numOfSubmissions + 1);
    let passed = 0;

    setLoading(true);
    for (let i of question.testcases) {
      let userInputEach = i.input;

      try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/execute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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

    if (question.testcases.length === passed) {
      passQuestion(question._id);
    }
    setAllOutput(out);
    setLoading(false);
  };

  const passQuestion = async (id) => {
    try {
      const token = Cookies.get("tokenUser");
      const uid = Cookies.get("uid");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/passQuestion/${id}?user_id=${uid}&exam_id=${exam_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        },
      })

      const parsed = await res.json();
      if (res.ok) {
        setTimeout(() => {
          getAllQuestions();
          setInput('');
          setOutput('')
          setAllOutput([]);
          setUserInput('')
        }, 3000);
        toast.success(parsed.message, {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
      else {
        toast.error(parsed.message, {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  const getAllQuestions = useCallback(async () => {
    try {
      const uid = Cookies.get("uid");
      const token = Cookies.get("tokenUser");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getExam/${exam_id}?user_id=${uid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        }
      });
      const parsed = await res.json();

      let passedQuestion = 0;
      parsed[0].questions.forEach(ques => {
        if (ques.passed) {
          passedQuestion++;
        }
      });

      if (passedQuestion === parsed[0].questions.length) {
        setTimeout(() => {
          setCompleted(true);
          localStorage.removeItem("counter");
        }, 3000)
      }

      setQuestions(parsed[0].questions);

      for (let i = 0; i < parsed[0].questions.length; i++) {
        if (!parsed[0].questions[i].passed) {

          filterData(parsed[0].questions[i]._id);
          break;
        }
      }


    } catch (err) {
      console.error(err);
    }
  }, [exam_id]);

  const filterData = async (idtoFilter) => {
    try {
      const token = Cookies.get("tokenUser");
      const res = await fetch(`http://localhost:7123/getQuestion/${idtoFilter}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        }
      })

      const parsed = await res.json();
      if (res.ok) {
        setQuestion(parsed[0]);
      }
      else {
        console.error("Error in getting Question");
      }

    }
    catch (err) {
      console.error(err);
    }
  };


  const formatTimer = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };


  const getTotalTestCases = async () => {
    try {
      const token = Cookies.get("tokenUser");

      const response = await fetch(`http://localhost:7123/noOfTestcases/${exam_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        }
      });

      const parsedCases = await response.json();
      return parsedCases;
    } catch (err) {
      console.error("Error fetching test cases:", err);
    }
  };



  const setScores = async () => {
    try {
      let sumOfPassedTestCases = Object.values(scoreUpdates).reduce((acc, currentVal) => acc + currentVal, 0);
      let givenTime = Math.floor(3600 / 60); // in minutes
      let timeTaken = Math.floor((3600 - time) / 60);  // in minutes
      let totalTestCases = await getTotalTestCases();


      const uid = Cookies.get("uid");
      const token = Cookies.get("tokenUser");

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/setuserScores/${exam_id}?user_id=${uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        },
        body: JSON.stringify({
          testCasesPassed: sumOfPassedTestCases,
          totalTestCases,
          timeTaken,
          givenTime,
          numOfSubmissions
        })
      })

      const parsed = await res.json();
      if (res.ok) {
        getAllQuestions();
        toast.success(parsed.message, {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
      else {
        toast.error(parsed.message, {
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: true,
          closeButton: false,
        });
      }
      navigate(`/score/${exam_id}`);
    }
    catch (err) {
      console.error(err);
    }
  }


  const handlePaste = (e) => {
    e.preventDefault();
    setInput("Don't try to Cheat");
  }

  // UseEffects

  // Timer
  useEffect(() => {
    let timer;

    if (time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setCompleted(true);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [time]);


  // Get Questions
  useEffect(() => {
    getAllQuestions();
  }, [getAllQuestions]);


  // Checking the tab Change
  useEffect(() => {

    const handleLoad = () => {
      if (!warning) {
        setWarningCount(prevCount => prevCount + 1);
        setWarning(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !warning) {
        setWarning(true);
        setWarningCount(prevCount => prevCount + 1);
      }
    };

    const handleBlur = () => {
      if (!warning) {
        setWarningCount(prevCount => prevCount + 1);
        setWarning(true);
      }
    };

    window.addEventListener('load', handleLoad);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Warning
  useEffect(() => {
    if (warningCount === 2) {
      setDanger(true);
      setWarningCount(0);
    }

  }, [warningCount]);

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
          <Button variant='contained' style={{ backgroundColor: "#FF2626", width: "200px" }} onClick={setScores}>
            Submit Exam
          </Button>
        </Toolbar>
      </AppBar>


      {/* Dialog Boxes */}
      {warning && <WarningDialog open={warning} setWarning={setWarning} />}
      {<DangerDialog open={danger} setScores={setScores} setDanger={setDanger} />}

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


              <div style={{ position: 'relative', display: 'inline-block', width: '100%', border: '2px solid black', borderRadius: 10 }}>
                {/* Line Numbers div */}
                <div ref={lineNumbersRef} style={{
                  position: 'absolute',
                  top: '13px',
                  left: '8px',
                  background: 'transparent',
                  borderRadius: '5px',
                  width: '40px',
                  maxHeight: '570px',
                  zIndex: '1',
                  pointerEvents: 'none',
                  color: '#000',
                  whiteSpace: 'pre-wrap',
                  fontSize: '20px',
                  overflowY: 'hidden',
                  height: '570px'
                }}>
                  {getLineNumbers(input).map((lineNumber) => (
                    <div key={lineNumber}>{lineNumber}</div>
                  ))}
                </div>

                {/* Textarea Section */}
                <TextField
                  id="code-editor"
                  multiline
                  placeholder="Write your code here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={ (e) => { handleKeyPress(e,input,setInput) }}
                  onPaste={handlePaste}
                  ref={textareaRef}
                  fullWidth
                  sx={{
                    maxHeight: '580px',
                    marginBottom: 2,
                    border: 'none',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    position: 'relative',
                    paddingLeft: '25px',
                    fontSize: '16px',
                    height: '580px',
                    overflowY: 'auto',
                    resize: 'none',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:focus-visible': {
                      outline: 'none',
                    }
                  }}
                />

              </div>

              {/* <TextField
                fullWidth
                multiline
                minRows={19}
                variant="outlined"
                placeholder="Write your code here"
                onPaste={handlePaste}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                sx={{ flex: 1, overflow: "scroll" }}
              /> */}

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
                    loading && <BallTriangle
                      height={100}
                      width={100}
                      radius={5}
                      color="#4fa94d"
                      ariaLabel="ball-triangle-loading"
                      wrapperStyle={{ margin: 5 }}
                      wrapperClass=""
                      visible={true}
                    />
                  }
                  {output}
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
