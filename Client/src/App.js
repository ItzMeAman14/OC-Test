import React, { useState, useEffect } from 'react';
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
import ForgetPassword from './components/ForgetPassword';
import ChangePassword from './components/ChangePassword';

import Testing from './components/Testing';

// Context
import { MessageProvider } from './components/context/MessageContext';
import { AuthProvider } from "./components/context/AuthContext";

// Protected Routes
import { ProtectedRouteAdmin, ProtectedRouteUser, ProtectedRouteForPasswordRecovery } from './components/context/AuthContext';
import MobileWarning from './components/MobileWarning';

function App() {
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const checkIfMobileScreen = () => {
    setIsMobileScreen(window.innerWidth <= 1200);
  }

  useEffect(() => {
    checkIfMobileScreen();
    window.addEventListener('resize', checkIfMobileScreen)

    return () => window.removeEventListener('resize', checkIfMobileScreen)
  }, [])

  return (
    <AuthProvider>
      <MessageProvider>

        {isMobileScreen ? <MobileWarning /> :
          <div className="App">
            <Router>
              <ToastContainer />
              <Routes>

                <Route exact path='/' element={
                  <>
                    <Navbar />
                    <Home />
                  </>
                } />

                <Route exact path='/exams' element={
                  <ProtectedRouteUser>
                    <Navbar />
                    <Messages />
                    <Exam />
                  </ProtectedRouteUser>
                } />

                <Route exact path="/about" element={
                  <>
                    <Navbar />
                    <About />
                  </>
                } />

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

                <Route exact path="/forget-password" element={<ForgetPassword />} />

                <Route exact path="/new-password/:email" element={
                  <ProtectedRouteForPasswordRecovery>
                    <ChangePassword />
                  </ProtectedRouteForPasswordRecovery>
                } />

                <Route exact path="/signup" element={<Signup />} />

                <Route exact path="/contact" element={
                  <>
                    <Navbar />
                    <Contact />
                  </>
                } />

                <Route exact path="/testing/:exam_id" element={
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
        }

      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
