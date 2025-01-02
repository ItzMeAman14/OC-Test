import Navbar from './components/Navbar';
import Home from './components/Home';
import Chat from './components/Chat';
import Exam from './components/Exam';
import About from './components/About';
import ExamDetail from './components/ExamDetail';
import { useEffect, useState } from 'react';
import Alert from './components/Alert';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

function App() {
  const [mode, setMode] = useState('');
  const [Modelogo, setModelogo] = useState('moon');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    const storedModeLogo = localStorage.getItem("logo");

    if(storedMode){
      setMode(storedMode);
      setModelogo(storedModeLogo);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mode', mode);
    localStorage.setItem('logo', Modelogo);
  }, [mode,Modelogo]);

  const showAlert = (message,type) => {
    setAlert({
      msg:message,
      type:type
    })
    setTimeout(() => {
      setAlert(null);
    },3000);
  }
  
  return (
    <div className={`App ${mode}`}>

      <Router>

        <Navbar setMode={setMode} Modelogo={Modelogo} setModelogo={setModelogo} mode={mode} />
        <Routes>

        <Route exact path='/' element={
          <>
          <Home showAlert={showAlert} alert={alert} />
          </>
        }/>

        <Route exact path='/chat' element={
          <Chat/>
        }/>
          
        <Route exact path='/exams' element={
          <Exam/>
        }/>

        <Route exact path="/about" element={
          <About/>} 
        />

        <Route exact path="/exams/:id" element={
          <ExamDetail />} 
        />


        </Routes>
      </Router>
    </div>
  );
}

export default App;
