import { useState, useEffect, useRef, useCallback } from "react"
import handleKeyPress from "./TextEditorFunctions/SpecialCharAutoComplete"
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Grid,
  Box,
  IconButton,
} from "@mui/material"
import { AccessTime, PlayArrow, Send, QuestionAnswer, Loop } from "@mui/icons-material"
import Cookies from "js-cookie"
import { useParams, useNavigate } from "react-router-dom"
import { useToast } from './context/ToastContext'; 
import WarningDialog from "../DialogBox/WarningDialog"
import DangerDialog from "../DialogBox/DangerDialog"
import Loader from "./Loader"
import LeaderBoard from "./LeaderBoard"
import { useLeaderBoard } from "./context/Leaderboard"

const ExamDetail = () => {
  const uid = Cookies.get("uid");
  const { showSuccess, showError } = useToast()
  const { calculateScore, setLeaderboard } = useLeaderBoard();
  const navigate = useNavigate();
  const { exam_id } = useParams();

  const [code, setCode] = useState("")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [timeLeft, setTimeLeft] = useState(3600)
  const [language, setLanguage] = useState("python3")
  const [codeLines, setCodeLines] = useState(1)
  const [showOutput, setShowOutput] = useState(false)
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState([]);
  const [allOutput, setAllOutput] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  // For leaderBoard
  const [leaderboardVisibility, setLeaderboardVisibility] = useState(false);
  const [currentUserLeaderBoard, setCurrentUserLeaderBoard] = useState({});
  const [totalSubmissionByUser,setTotalSubmissionByUser] = useState(0);
  const [currentUserScore,setCurrentUserScore] = useState(null);

  // Ref
  const codeEditorRef = useRef(null)
  const lineNumbersRef = useRef(null)

  // For Scores
  const [scoreUpdates, setScoreUpdates] = useState([]);

  // For Warnings and Security
  const [warning, setWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [danger, setDanger] = useState(false);

  // Timer
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          setCompleted(true);
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])


  // Score Metrices Functions

  // This function will check if question exist then update the question and if not exits then create new Question
  const addOrUpdateQuestion = (userId, questionId, newQuestionData) => {
    
    const updatedScores = scoreUpdates.map((user) => {
      if (user.hasOwnProperty(userId)) {

        const userQuestions = user[userId];
        const existingQuestionIndex = userQuestions.findIndex(q => q.hasOwnProperty(questionId));

        if (existingQuestionIndex !== -1) {
          userQuestions[existingQuestionIndex] = { [questionId]: newQuestionData };
        } else {
          userQuestions.push({ [questionId]: newQuestionData });
        }

        return {
          ...user,
          [userId]: userQuestions,
        };
      }
      return user;
    });

    setScoreUpdates(updatedScores);
  };


  const getSubmissionValue = (userId, questionId) => {

    const user = scoreUpdates.find(user => user.hasOwnProperty(userId));

    if (user) {
      const userQuestions = user[userId];
      const question = userQuestions.find(q => q.hasOwnProperty(questionId));

      if (question) {

        return question[questionId].totalSubmission;
      } 
        return 0;
      }
  } 

  const getScoreMetrices = (userId, questionId) => {

    const user = scoreUpdates.find(user => user.hasOwnProperty(userId));

    if (user) {
      const userQuestions = user[userId];
      const question = userQuestions.find(q => q.hasOwnProperty(questionId));

      if (question) {

        return question[questionId];
      } 
        return null;
      }
  } 

  const addNewUserScoreMetrices = (userId) => {

    const userExists = scoreUpdates.some(user => user.hasOwnProperty(userId));

    if (!userExists) {
      const updatedScores = [...scoreUpdates, { [userId]: [] }];
      setScoreUpdates(updatedScores);
    }
  }

  const runAll = async () => {
    const uid = Cookies.get("uid");
    const out = [];
    setOutput("");
    setAllOutput([]);
    setTotalSubmissionByUser(totalSubmissionByUser + 1);
    let passed = 0;
    
    setShowOutput(true);
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
            input: code,
            lang: language,
            "userInputs": userInputEach
          }),
        });
        let outputResponse = await response.json();
        
        if (!outputResponse.ok) {
          console.error(outputResponse.error);
        }
        if(!outputResponse.isExecutionSuccess){
          setAllOutput([]);
          setOutput(outputResponse.output)
        }
        else{
          if (i.output !== outputResponse.output) {
            out.push({ "icon": "fa-solid fa-face-sad-tear", "color": "red" });
          } else {
            passed++;
            out.push({ "icon": "fa-solid fa-face-smile", "color": "green" });
          }
        }
      }
      catch (err) {
        console.error(err);
      }
    }

    if (question.testcases.length === passed) {

      const totalSubmissionDone = getSubmissionValue(uid,question._id)

      addOrUpdateQuestion(uid,question._id,{timeTakenInMs:(3600 - timeLeft),testCasesPassed:passed,totalSubmission:(totalSubmissionDone + 1 )})
      passQuestion(question._id);
    }
    setAllOutput(out);
    setLoading(false);
  };


  const updateScore = async(newScore) => {
    try{
      const token = Cookies.get("tokenUser")
      const uid = Cookies.get("uid");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/updateScore/${uid}?exam_id=${exam_id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        },
        body:JSON.stringify({
          newScore
        })
      })

      const parsed = await res.json();
      setLeaderboard(parsed);
    }
    catch(err){
      console.error(err)
    }
  }

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

      const metrices = getScoreMetrices(uid,id)
      const score = calculateScore(question.testcases.length,3600,1,metrices.testCasesPassed,metrices.timeTakenInMs,metrices.totalSubmission)
      const newScore = (1000*score)/100 + (currentUserLeaderBoard.score ?? 0)
      updateScore(newScore);
      setCurrentUserScore(newScore)
       
      const parsed = await res.json();
      if (res.ok) {
        setTimeout(() => {
          getAllQuestions();
          setInput('');
          setCode('');
          setOutput('')
          setAllOutput([]);
        }, 3000);
        showSuccess(parsed.message);
      }
      else {
        showError(parsed.message);
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  const runCustomCode = async () => {
    try {
      setOutput('');
      setAllOutput([]);
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: code,
          lang: language,
          userInputs: input
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



  const getTotalTestCases = async (id) => {
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


  const removeUserFromLeaderboard = async (userId) => {
    try{
      const token = Cookies.get("tokenUser");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/removeUserInLeaderboard/${exam_id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          "userAPIKEY": token
        },
        body:JSON.stringify({
          id:userId
        })
      })

      const parsed = await res.json();
      if(res.ok){
        setLeaderboard(parsed);
      }

    }
    catch(err){
      console.error(err)
    }
  }

  const setScores = async () => {
    try {
      const uid = Cookies.get("uid");

      let sumOfPassedTestCases = 0;

      scoreUpdates.map((score) => {
        if(Object.keys(score)[0] == uid){
            score[uid].map((ques) => {
                sumOfPassedTestCases += ques[Object.keys(ques)[0]].testCasesPassed
            })
        }
      })

      let givenTime = Math.floor(3600 / 60); // in minutes
      let timeTaken = Math.floor((3600 - timeLeft));  // in seconds
      let totalTestCases = await getTotalTestCases();

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
          numOfSubmissions:totalSubmissionByUser,
          finalScore:currentUserScore,
          totalScore: (questions.length * 1000)
        })
      })

      const parsed = await res.json();
      if (res.ok) {
        removeUserFromLeaderboard(uid);
        getAllQuestions();
        showSuccess(parsed.message);
      }
      else {
        showError(parsed.message);
      }
      navigate(`/score/${exam_id}`);
    }
    catch (err) {
      console.error(err);
    }
  }

  // Submit entire exam
  const submitExam = () => {
    if (window.confirm("Are you sure you want to submit the exam? This action cannot be undone.")) {
      setScores();
    }
  }

  const handleCodeChange = (e) => {
    const newCode = e.target.value
    setCode(newCode)

    // Count the number of lines
    const lines = newCode.split("\n").length
    setCodeLines(Math.max(lines, 1))
  }


  const renderLineNumbers = () => {
    return Array.from({ length: codeLines }, (_, i) => (
      <div
        key={i}
        style={{
          height: "24px",
          width: "100%",
          textAlign: "center",
          lineHeight: "24px",
          color: "#757575",
          fontSize: "16px",
        }}
      >
        {i + 1}
      </div>
    ))
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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getQuestion/${idtoFilter}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        }
      })

      const parsed = await res.json();
      if (res.ok) {
        setQuestion(parsed[0]);
        setShowOutput(false)
      }
      else {
        console.error("Error in getting Question");
      }

    }
    catch (err) {
      console.error(err);
    }
  };


  const getUser = async (id) => {
    
    try{
      const token = Cookies.get("tokenUser");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getUserById/${id}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "userAPIKEY": token
        }
      });
      const parsed = await res.json();
      return parsed;
    }
    catch(err){
      console.error(err);
    }
  }

  const handleScroll = () => {
    if (lineNumbersRef.current && codeEditorRef.current) {
      lineNumbersRef.current.scrollTop = codeEditorRef.current.scrollTop;
    }
  };


  const sendCurrentUserToParent = (CurUser) => {
    setCurrentUserLeaderBoard(CurUser);
  }

  useEffect(() => {
    const textarea = codeEditorRef.current;

    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);

      return () => {
        textarea.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);


  // Checking the tab Change
  useEffect(() => {

    const handleVisibilityChange = () => {
      if (document.hidden && !warning) {
        setWarning(true);
        setWarningCount(prevCount => prevCount + 1);
      }
    };

    const handlePopState = (e) => {
      window.history.pushState(null, "", window.location.href);
    }

    const handleBlur = () => {
      setWarning(true);
    }

    window.addEventListener('keydown', function (event) {
      if ((event.key === 'F5') || (event.ctrlKey && event.key === 'r') || (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight"))) {
        event.preventDefault();
      }
    });

    window.addEventListener('beforeunload', function (event) {
      event.preventDefault();
      event.returnValue = '';
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('popstate', handlePopState)
    document.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('popstate', handlePopState)
      document.removeEventListener('blur', handleBlur)
    };
  }, []);


  // Danger (Last Warning)
  useEffect(() => {
    if (warningCount === 3) {
      setDanger(true);
      setWarningCount(0);
    }

  }, [warningCount]);

  useEffect(() => {
    getAllQuestions();
  }, [getAllQuestions]);


  useEffect(() => {
    const uid = Cookies.get("uid");

    const getAndStoreUserData = async (uid) => {
      
          const token = Cookies.get("tokenUser")
          const user = await getUser(uid);
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/addUserInLeaderboard/${exam_id}`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
            "userAPIKEY":token
          },
          body:JSON.stringify({
            id:uid,
            email:user.email
          })

        })
        const parsed = await res.json();
        setLeaderboard(parsed);
        addNewUserScoreMetrices(uid);
      
    }

    getAndStoreUserData(uid);

  },[uid])

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      {/* Timer Navbar */}
      <Paper
        elevation={2}
        style={{
          backgroundColor: "#000000",
          color: "white",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 0,
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AccessTime style={{ fontSize: 24 }} />
          <Typography
            variant="h6"
            style={{
              fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </Box>
        
        <Box style={{
          display:"flex",
          gap:"6px"
        }}>

          <Button
            variant="contained"
            onClick={() => { leaderboardVisibility ? setLeaderboardVisibility(false) : setLeaderboardVisibility(true) }}
            style={{
              backgroundColor: "white",
              color: "black",
              fontWeight: "bold",
              textTransform: "none",
            }}
            >
            { leaderboardVisibility ? "Go to Question" : "Show Leaderboard" }
          </Button>

          <Button
            variant="contained"
            onClick={submitExam}
            style={{
              backgroundColor: "white",
              color: "black",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Submit Exam
          </Button>
        
        </Box>

      </Paper>

      {/* Dialog Boxes */}
      {warning && <WarningDialog open={warning} setWarning={setWarning} />}
      {<DangerDialog open={danger} setScores={setScores} setDanger={setDanger} />}

      
      { leaderboardVisibility ? <LeaderBoard sendCurrentUserToParent={sendCurrentUserToParent} examId={exam_id} /> : ( <>
          
      {/* Main Content */}
      <Grid container spacing={2} style={{ flex: 1, padding: 16 }}>
        {/* Question/Output Section (Toggleable) */ }
        <Grid item xs={12} md={4}>
          {!showOutput ? (
            <Paper
              elevation={1}
              style={{
                height: "100%",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                position: "relative",
              }}
            >

              <Box
                style={{
                  textAlign: "right",
                  top: 8,
                  left: 8,
                  zIndex: 1,
                }}
              >
                <IconButton
                  onClick={() => setShowOutput(true)}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #e0e0e0",
                  }}
                  size="small"
                  title="Custom Run"
                >
                  <Loop fontSize="small" />
                </IconButton>
              </Box>


              <Typography
                variant="h5"
                style={{
                  fontWeight: "bold",
                  marginBottom: 16,
                  color: "#000000",
                }}
              >
                {question.heading}
              </Typography>
              <Typography
                variant="body1"
                style={{
                  color: "#424242",
                  textAlign: "justify",
                  fontSize: "22px",
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {question.statement}
              </Typography>
            </Paper>
          ) : (
            <Paper
              elevation={1}
              style={{
                height: "100%",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                position: "relative",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  zIndex: 1,
                }}
              >
                <IconButton
                  onClick={() => setShowOutput(false)}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #e0e0e0",
                  }}
                  size="small"
                  title="Show Question"
                >
                  <QuestionAnswer fontSize="small" />
                </IconButton>
              </Box>

              <Typography
                variant="subtitle1"
                style={{
                  fontWeight: "bold",
                  marginBottom: 8,
                  marginTop: 8,
                  color: "#000000",
                  textAlign: "center"
                }}
              >
                Custom Input
              </Typography>

              <TextField
                placeholder="Enter input for your code..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                style={{ marginBottom: 5 }}
              />

              {
                completed ?

                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    disabled
                    style={{
                      backgroundColor: "#000000",
                      color: "white",
                      textTransform: "none",
                      height: 56,
                    }}
                  >
                    Custom run
                  </Button>

                  :
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={runCustomCode}
                    style={{
                      backgroundColor: "#000000",
                      color: "white",
                      textTransform: "none",
                      height: 56,
                    }}
                  >
                    Custom run
                  </Button>
              }

              <Typography
                variant="subtitle1"
                style={{
                  fontWeight: "bold",
                  marginBottom: 8,
                  color: "#000000",
                  textAlign: "center"
                }}
              >
                Output
              </Typography>
              <Box
                style={{
                  height: "100%",
                  backgroundColor: "#f5f5f5",
                  padding: 12,
                  borderRadius: 4,
                  fontFamily: "monospace",
                  fontSize: 16,
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  border: "1px solid #e0e0e0",
                }}
              > 
                { loading && <Loader /> }
                {(!output && allOutput.length === 0 && !loading) && "Your output will appear here"}
                {output ? output :
                  <Grid container spacing={2}>
                    {allOutput.map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Box className="col" sx={{ textAlign: 'center' }}>
                          <i
                            className={`${item.icon}`}
                            style={{
                              color: item.color,
                              fontSize: 30,
                              padding: 10,
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                }

              </Box>
            </Paper>
          )}
        </Grid>

        {/* Code Editor Section */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={1}
            style={{
              height: "100%",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                gap: 8,
              }}
            >
              <FormControl style={{ flex: 1 }}>
                <InputLabel id="language-select-label">Language</InputLabel>
                <Select
                  labelId="language-select-label"
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value="python3">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                </Select>
              </FormControl>

              {completed ?
                <Button
                  variant="outlined"
                  startIcon={<Send />}
                  disabled
                  style={{
                    borderColor: "#000000",
                    color: "#000000",
                    textTransform: "none",
                    height: 56
                  }}
                >
                  Submit Answer
                </Button>
                :
                <Button
                  variant="outlined"
                  startIcon={<Send />}
                  onClick={runAll}
                  style={{
                    borderColor: "#000000",
                    color: "#000000",
                    textTransform: "none",
                    height: 56
                  }}
                >
                  Submit Answer
                </Button>
              }

            </Box>

            <Box
              style={{
                flex: 1,
                position: "relative",
                border: "1px solid #e0e0e0",
                borderRadius: 4,
              }}
            >
              <Box
                ref={lineNumbersRef}
                style={{
                  position: "absolute",
                  height: "100%",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "48px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: "8px",
                  fontFamily: "monospace",
                  borderRight: "1px solid #e0e0e0",
                  overflow: "hidden",
                  userSelect: "none",
                }}
              >
                {renderLineNumbers()}
              </Box>
              <textarea
                ref={codeEditorRef}
                style={{
                  width: "90%",
                  height: "100%",
                  fontFamily: "monospace",
                  backgroundColor: "white",
                  resize: "none",
                  paddingLeft: "50px",
                  paddingTop: "8px",
                  paddingRight: "8px",
                  paddingBottom: "8px",
                  border: "none",
                  outline: "none",
                  lineHeight: "24px",
                  fontSize: "22px",
                  overflow: "hidden",
                }}
                placeholder="Write your code here..."
                value={completed ? "You have completed the exam.Submit to complete it." : code}
                onChange={handleCodeChange}
                onPaste={(e) => { e.preventDefault() }}
                onKeyDown={(e) => { handleKeyPress(e, code, setCode) }}
                spellCheck="false"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Question Navigation */}
      <Paper
        elevation={2}
        style={{
          padding: 16,
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 5,
          overflowX: "auto",
          borderRadius: 0,
          backgroundColor: "white",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        {questions.map((ques, index) => (
          (ques.passed || completed) ?

            <Button
              key={ques._id}
              variant="outlined"
              disabled
              style={{
                minWidth: 40
              }}
            >
              {index + 1}
            </Button>
            :
            <Button
              key={ques._id}
              variant={question._id === ques._id ? "contained" : "outlined"}
              onClick={() => filterData(ques._id)}
              style={{
                minWidth: 40,
                backgroundColor: question._id === ques._id ? "#000000" : "white",
                color: question._id === ques._id ? "white" : "#000000",
                borderColor: "#000000",
              }}
            >
              {index + 1}
            </Button>

        ))}
      </Paper>
      
      </>
    )}
    </Box>
  )
}

export default ExamDetail;