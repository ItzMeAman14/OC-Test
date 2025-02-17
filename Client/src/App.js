import React,{ useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Exam from './components/Exam';
import About from './components/About';
import ExamDetail from './components/ExamDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./components/admin/Dashboard"
import Login from "./components/Login"
import Messages from './components/Messages';
import { ToastContainer } from 'react-toastify';
import Contact from './components/Contact';
import Analytics from './components/admin/Analytics';

// Context
import { MessageProvider } from './components/context/MessageContext';

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
    <MessageProvider>

    <div className={`App ${mode}`}>

      <Router>
        <Messages />
        <ToastContainer />
        <Routes>

        <Route exact path='/' element={
          <>
          <Navbar setMode={setMode} Modelogo={Modelogo} setModelogo={setModelogo} mode={mode} />
          <Home showAlert={showAlert} alert={alert} />
          </>
        }/>
          
        <Route exact path='/exams' element={
          <>
          <Navbar setMode={setMode} Modelogo={Modelogo} setModelogo={setModelogo} mode={mode} />
          <Exam/>
          </>
        }/>

        <Route exact path="/about" element={
          <>
          <Navbar setMode={setMode} Modelogo={Modelogo} setModelogo={setModelogo} mode={mode} />
          <About/>
          </>
        }/>

        <Route exact path="/exams/:exam_id" element={
          <ExamDetail />
          } 
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
          <>
          <Navbar setMode={setMode} Modelogo={Modelogo} setModelogo={setModelogo} mode={mode} />
          <Contact />
          </>
        }
        />

        <Route exact path="/score" element={
          <>
          <Navbar setMode={setMode} Modelogo={Modelogo} setModelogo={setModelogo} mode={mode} />
          <Analytics />
          </>
        }
        />

        </Routes>
      </Router>
    </div>
    </MessageProvider>
  );
}

export default App;
