import React, { useState } from 'react';
import '../css/test.css';

function About() {

  const [lang, setLang] = useState('python3');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [userInputs, setUserInputs] = useState('');
  const [allOutput, setAllOutput] = useState([]);

  const data = [
    {
      "_id": {
        "$oid": "672dd5fbe4595b9610477549"
      },
      "name": "Allenhouse Y1 AIML",
      "questions": [
        {
          "statement": "Write a program to find factorial of a given integer n.",
          "id": {
            "$oid": "672de9edf3263a7854d1387b"
          },
          "testcases": [
            {
              "input": "5",
              "output": "120"
            },
            {
              "input":"0",
              "output": "1"
            },
            {
              "input": "-1",
              "output": "-1"
            }
          ]
        },
        {
          "statement": "This is the question 2.",
          "id": {
            "$oid": "672dea38f3263a7854d1387c"
          },
          "testcases": [
            "To be done"
          ]
        },
        {
          "statement": "This is the question 3.",
          "id": {
            "$oid": "672e0849f3263a7854d13880"
          },
          "testcases": [
            "To be done"
          ]
        },
        {
          "statement": "This is the question 4.",
          "id": {
            "$oid": "672e0851f3263a7854d13882"
          },
          "testcases": [
            "To be done"
          ]
        },
        {
          "statement": "This is the question 5.",
          "id": {
            "$oid": "672e0859f3263a7854d13884"
          },
          "testcases": [
            "To be done"
          ]
        },
        {
          "statement": "This is the question 6.",
          "id": {
            "$oid": "672e085ff3263a7854d13886"
          },
          "testcases": [
            "To be done"
          ]
        }
      ]
    }
  ]

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
          userInputs
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
          out.push({"icon":"fa-solid fa-hand-middle-finger","color":"red"})
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


  const [question, setquestion] = useState(data[0].questions[0]);
  const filterData = (idtoFilter) => {

    const ques = data[0].questions.filter(ques => ques.id === idtoFilter);
    setquestion(ques[0]);
  }

  const getIndexByStatement = (statement) => {
    return data[0].questions.findIndex((question) => question.statement === statement);
  }

  return (
    <>
      <ul className="nav nav-tabs">
        {
          data[0].questions.map((i, j) => {
            return (
              <li key={i.id.$oid} className="nav-item">
                <button className="nav-link bg-transparent" onClick={() => { filterData(i.id) }}>{j + 1}</button>
              </li>
            )
          })
        }

      </ul>
      <div className={`wrapper`}>


        {/* Question Box */}
        <div className="question-box">
          <h2 className='question-heading'>Question No. { getIndexByStatement(question.statement) + 1}</h2>
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

export default About;
