import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Exam from './components/Exam';
import About from './components/About';
import ExamDetail from './components/ExamDetail';
import Dashboard from "./components/admin/Dashboard";
import Login from "./components/Auth/Login";
import Messages from './components/Messages';
import Contact from './components/Contact';
import Analytics from './components/admin/Analytics';
import Signup from './components/Auth/Signup';
import ForgetPassword from './components/Auth/ForgetPassword';
import ChangePassword from './components/Auth/ChangePassword';

import Testing from './components/Testing';

// Context
import { MessageProvider } from './components/context/MessageContext';
import { AuthProvider } from "./components/context/AuthContext";
import { LeaderboardProvider } from "./components/context/Leaderboard";
import { ToastProvider } from "./components/context/ToastContext";

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
      <ToastProvider>
        <LeaderboardProvider>
          <MessageProvider>

        {isMobileScreen ? <MobileWarning /> :
          <div className="App">
            <Router>

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
                  <>
                  <Navbar />
                  <Testing />
                  </>
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
        </LeaderboardProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
