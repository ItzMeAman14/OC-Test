import React,{ useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Exam from './components/Exam';
import About from './components/About';
import ExamDetail from './components/ExamDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./components/admin/Dashboard"
import Login from "./components/Login"
import Messages from './components/admin/Messages';
import { ToastContainer } from 'react-toastify';
import Contact from './components/Contact';

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
        <Messages />
        <ToastContainer />
        <Routes>

        <Route exact path='/' element={
          <>
          <Home showAlert={showAlert} alert={alert} />
          </>
        }/>
          
        <Route exact path='/exams' element={
          <Exam/>
        }/>

        <Route exact path="/about" element={
          <About/>} 
        />

        <Route exact path="/exams/:exam_id" element={
          <ExamDetail />} 
        />

        <Route exact path="/admin" element={
          <Dashboard />
        }
        />

        <Route exact path="/login" element={
          <Login />
        }
        />

        <Route exact path="/contact" element={
          <Contact />
        }
        />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
