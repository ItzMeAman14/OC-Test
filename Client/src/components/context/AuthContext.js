import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext); 
};


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
  
  useEffect(() => {
    const tokenUser = Cookies.get('uid');  
    const tokenAdmin = Cookies.get('adminid'); 
    
    setIsAuthenticatedUser(!!tokenUser);
    setIsAuthenticatedAdmin(!!tokenAdmin);
  }, []); 

  return (
    <AuthContext.Provider value={{ isAuthenticatedAdmin, isAuthenticatedUser }}>
      {children} 
    </AuthContext.Provider>
  );
};
