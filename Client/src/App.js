import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Exam from './components/Exam';
import About from './components/About';
import ExamDetail from './components/ExamDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./components/admin/Dashboard";
import Login from "./components/Login";
import Messages from './components/Messages';
import { ToastContainer } from 'react-toastify';
import Contact from './components/Contact';
import Analytics from './components/admin/Analytics';
import Signup from './components/Signup';

import Testing from './components/Testing';

// Context
import { MessageProvider } from './components/context/MessageContext';
import { AuthProvider } from "./components/context/AuthContext";

// Protected Routes
import { ProtectedRouteAdmin, ProtectedRouteUser } from './components/context/AuthContext';

function App() {

  return (
    <AuthProvider>
      <MessageProvider>

        <div className="App">
          <Router>
            <ToastContainer />
            <Routes>

              <Route exact path='/' element={
                <>
                  <Navbar />
                  <Home />
                </>
              }/>

              <Route exact path='/exams' element={
                <ProtectedRouteUser>
                  <Navbar />
                  <Messages />
                  <Exam />
                </ProtectedRouteUser>
              }/>

              <Route exact path="/about" element={
                <>
                  <Navbar />
                  <About />
                </>
              }/>

              <Route exact path="/exams/:exam_id" element={
                <ProtectedRouteUser>
                    <ExamDetail />
                </ProtectedRouteUser>
              } />

              <Route exact path="/admin" element={
                <ProtectedRouteAdmin>
                  <Dashboard />
                  <Messages />
                </ProtectedRouteAdmin>
              } />

              <Route exact path="/login" element={<Login />} />

              <Route exact path="/signup" element={<Signup />} />

              <Route exact path="/contact" element={
                <>
                  <Navbar />
                  <Contact />
                </>
              } />

              <Route exact path="/testing" element={
                <Testing />
              } />

              <Route exact path="/score/:id" element={
                <ProtectedRouteUser>
                  <Navbar />
                  <Analytics />
                  <Messages />
                </ProtectedRouteUser>
              } />

            </Routes>
          </Router>
        </div>

      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
