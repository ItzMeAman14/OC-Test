import React from 'react';
import { useState } from 'react';
import '../css/Home.css';
import Loader from './Loader';
import { toast } from "react-toastify";

function Home(props) {

    const [output, setOutput] = useState('');
    const [lang, setLang] = useState('python3');
    const [input, setInput] = useState('');
    const [load,setLoad] = useState({loading:false})
    const [userInputs, setuserInputs] = useState('');

    function handleKeyPress(event){
        const { selectionStart, selectionEnd } = event.target;
        if(event.key === "Tab"){
            event.preventDefault();
            const start  = selectionStart;
            const end  = selectionEnd;
            const spaces = '    ';
            setInput(input.substring(0,start) + spaces + input.substring(end));

            setTimeout(() => {
                event.target.selectionStart = event.target.selectionEnd = start + spaces.length;
            }, 0);
        }

        if( event.key === "("){
            event.preventDefault();

            setInput(input.substring(0,selectionStart) + '()' + input.substring(selectionEnd));

            setTimeout(() => {
                event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
            }, 0);
        }

        if( event.key === "{"){
            event.preventDefault();
            setInput(input.substring(0,selectionStart) + '{}' + input.substring(selectionEnd));
            setTimeout(() => {
                event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
            }, 0);
        }

        if( event.key === "'"){
            event.preventDefault();

            setInput(input.substring(0,selectionStart) + "''" + input.substring(selectionEnd));

            setTimeout(() => {
                event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
            }, 0);
        }

        if( event.key === '"'){
            event.preventDefault();

            setInput(input.substring(0,selectionStart) + '""' + input.substring(selectionEnd));

            setTimeout(() => {
                event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
            }, 0);
        }

        if( event.key === "["){
            event.preventDefault();

            setInput(input.substring(0,selectionStart) + "[]" + input.substring(selectionEnd));

            setTimeout(() => {
                event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
            }, 0);
        }

        if( event.key === "Enter"){
            const lastkey = input.charAt(input.length - 1); 
            if(lastkey === ":"){
                event.preventDefault();
                setInput(input.substring(0,selectionStart+1) + "\n    " + input.substring(selectionEnd));
                
                setTimeout(() => {
                    event.target.selectionStart = event.target.selectionEnd = selectionStart + 5;
                }, 0);
            }
        }
    }


    const executeCode = async () => {
        try {
            setLoad({loading:true})
            const response = await fetch('http://localhost:7123/execute', {
                method: "POST",
                headers: {
                'Content-Type':'application/json',
            },  
            body: JSON.stringify({
                input,
                lang,
                userInputs
            }),
        });
        if(!response.ok){
            throw new Error('Network response was not OK');
        }
        
        
        const data = await response.json();
        if(data.error === "Daily limit reached"){
            toast.error("Daily Limit Reached.Come Back Tomorrow.",{
                autoClose:5000,
                closeOnClick:false,
                pauseOnHover:true,
                hideProgressBar: false,
                closeButton:false
            })
        }
        else{
            toast.success("Code Compiled Successfully",{
                autoClose:5000,
                closeButton:false,
                closeOnClick:false,
                pauseOnHover:true,
                hideProgressBar: false
            })
        }
        setLoad({loading:false})
        setOutput(data.output || data.error);
    } 
    catch(error){   
        
        setOutput('Error Executing Code:'+ error.message);
        console.error(error);
        }
        
        // try{
        //     const res = await fetch('http://localhost:7123/credit')
        //     const creditDetail = await res.json();
        //     if(res.ok){
        //         let spentCredit = creditDetail.used;
        //         if(spentCredit === 20){
        //             props.showAlert(`Cannot Compile Code.Daily Credit is Already Used.`,'danger');
        //         }
        //         else{
        //             props.showAlert(`Code compiled Successfully.${spentCredit} Credits Used.${20-spentCredit} Credits left.`,'success');
        //         }
        //     }
        // }
        // catch(err){
        //     console.log(err);
        // }
    }

  return (
      <div className="main-container">
        <div className="left-container">
            <div className="editor-container">
                <select value={lang} onChange={(e) => setLang(e.target.value)} id="language-select">
                    <option value="python3">Python 3</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                </select>
                <textarea id="code-editor" className='fs-5' placeholder="Write your code here..." onChange={(e) => setInput(e.target.value)} value={input}  onKeyDown={handleKeyPress}></textarea>
                <button id="run-button" onClick={executeCode}>Run</button>
            </div>
        </div>
        <div className="output-container">
            <h2>Output</h2>
            <div id='output-con'>
                <div>Input Values:</div>
                <input value={userInputs} onChange={(i) => setuserInputs(i.target.value)} placeholder='Enter user input:'/>
                <pre id="output">{load.loading ? <Loader/> :output}</pre>
            </div>
        </div>
    </div>
  )
}

export default Home;
