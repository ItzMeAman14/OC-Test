import React from 'react';
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

  return (
    <MessageProvider>

    <div className="App">

      <Router>
        <Messages />
        <ToastContainer />
        <Routes>

        <Route exact path='/' element={
          <>
          <Navbar />
          <Home />
          </>
        }/>
          
        <Route exact path='/exams' element={
          <>
          <Navbar />
          <Exam/>
          </>
        }/>

        <Route exact path="/about" element={
          <>
          <Navbar />
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
          <Navbar />
          <Contact />
          </>
        }
        />

        <Route exact path="/score/:id" element={
          <>
          <Navbar />
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
