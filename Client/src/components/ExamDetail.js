import React, { useState,useEffect,useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useParams } from "react-router-dom";
import '../css/Examdetail.css';

function ExamDetail() {
  const { exam_id } = useParams();
  const [lang, setLang] = useState('python3');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [allOutput, setAllOutput] = useState([]);
  const [question, setQuestion] = useState([]);
  const [questions, setQuestions] = useState([]);

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
          userInputs:""
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

  }

  const runAll = async () => {
      const out = [];
      
      for (let i of question.testcases) {
        let userInputEach = i.input;
        
        try{

          let response = await fetch('http://localhost:7123/execute', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input,
            lang,
            "userInputs":userInputEach
          }),
        });
        let outputResponse = await response.json();

        if(!outputResponse.ok){
          console.log(outputResponse.error);
          
          console.log("Some error Occured");
        }
        
        if(i.output !== outputResponse.output){
          out.push({"icon":"fa-solid fa-face-sad-tear","color":"red"})
        }
        else{
          out.push({"icon":"fa-solid fa-face-smile","color":"green"})
        }
      }
      catch(err){
        console.error(err);
      }
    }
    setAllOutput(out)
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
  }


  useEffect(() => {
    getAllQuestions();
  }, [getAllQuestions]);

  return (
    <>

<AppBar position="sticky" sx={{ backgroundColor: 'black' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Timer in the middle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          <Typography variant="h6" sx={{ color: '#FF2626', fontSize: '1.2rem' }}>
            Timer: 1
          </Typography>
        </Box>

        {/* Right Side Button */}
        <Button variant='contained' style={{ backgroundColor: "#FF2626", width: "200px" }}>
          Submit Exam
        </Button>
      </Toolbar>
    </AppBar>

      <ul className="nav nav-tabs">
        {
          questions.map((i, j) => {
            return (
              <li key={i._id} className="nav-item">
                <button className="nav-link bg-transparent" onClick={() => { filterData(i._id) }}>{j + 1}</button>
              </li>
            )
          })
        }

      </ul>
      <div className={`wrapper`}>


        {/* Question Box */}
        <div className="question-box">
          <h2 className='question-heading'>{question.heading}</h2>
          <p className='question-desc'>{question.statement}</p>
        </div>

        {/* Input Box */}
        <textarea className="input-box" placeholder='Write your code here' onInput={(e) => { setInput(e.target.value) }} />

        <select className="lang-select" defaultValue="Python 3" onInput={(e) => { setLang(e.target.value) }}>
          <option value="python3">Python 3</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>


        <div className="fourth-box">
        <div className="toggle-button">
          <button onClick={executeCode} className='btn btn-sm run-buttons'><i className='fa-solid fa-play'></i></button>
          <button onClick={runAll} className='run-buttons'>Submit</button>
        </div>
          <h2 className='output-heading'>Output</h2>
          <p className='custom-output'>{output}</p>

          <hr className='dividing-line'/> 
          
          <div className="container-fluid">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {allOutput && allOutput.map((item, index) => (
                <div key={index} className="col">
                  <i 
                    className={`${item.icon}`} 
                    style={{
                      color: item.color,
                      fontSize: 40,
                      padding: 20,
                      display: 'block',
                      textAlign: 'center'
                    }}
                  ></i>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}

export default ExamDetail;
