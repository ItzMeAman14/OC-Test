import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext); 
};

// For Forget Password
export const ProtectedRouteForPasswordRecovery = ({ children }) => {
  const { isAuthenticatedRecovery } = useAuth();
  
  if(!isAuthenticatedRecovery){
    return <Navigate to="/forget-password" />
  }

  return children;
}


// For Users
export const ProtectedRouteUser = ({ children }) => {
    const { isAuthenticatedUser } = useAuth();
    
    if(!isAuthenticatedUser){
      return <Navigate to="/login" />
    }

    return children;
}

// For Admins
export const ProtectedRouteAdmin = ({ children }) => {
  const { isAuthenticatedAdmin } = useAuth();
  
  if(!isAuthenticatedAdmin){
    return <Navigate to="/login" />
  }

  return children;
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(true);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(true);
  const [isAuthenticatedRecovery, setIsAuthenticatedRecovery] = useState(true);
  
  useEffect(() => {
    const tokenUser = Cookies.get('uid');  
    const tokenAdmin = Cookies.get('adminid'); 
    const tokenRecovery = Cookies.get('recoverID');

    setIsAuthenticatedUser(!!tokenUser);
    setIsAuthenticatedAdmin(!!tokenAdmin);
    setIsAuthenticatedRecovery(!!tokenRecovery);
  }, []); 

  return (
    <AuthContext.Provider value={{ isAuthenticatedAdmin, isAuthenticatedUser, isAuthenticatedRecovery, setIsAuthenticatedUser, setIsAuthenticatedAdmin, setIsAuthenticatedRecovery }}>
      {children} 
    </AuthContext.Provider>
  );
};
