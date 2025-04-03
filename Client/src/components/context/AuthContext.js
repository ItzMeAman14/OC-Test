import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext); 
};

export const checkTokenExpiry = (token) => {
  if (!token) return true;
  try{
    const decoded = jwtDecode(token)

    const expiryTime = decoded.exp;
    const currentTime = Date.now() / 1000
    return currentTime > expiryTime
  }
  catch(err){
    console.error(err);
  }
}

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
    const tokenUserJWT = Cookies.get("tokenUser");
    const tokenAdminJWT = Cookies.get("tokenAdmin");

    if(checkTokenExpiry(tokenUserJWT)){
      Cookies.remove('uid');
      Cookies.remove("tokenUser")
    }
    else if(checkTokenExpiry(tokenAdminJWT)){
      Cookies.remove("adminid")
      Cookies.remove("tokenAdmin");
    }

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
