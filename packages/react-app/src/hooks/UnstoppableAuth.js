import React, { useState, useEffect, useContext, createContext } from "react";
import UAuth from '@uauth/js';
const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const uauth = new UAuth({
    clientID: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URIS,
     // Must include both the openid and wallet scopes.
    scope: 'openid wallet',
})
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = async () => {
         
    
    const authorization=await uauth.loginWithPopup()
    setUser(authorization);
    return authorization
  };

  
  const signout = () => {
    uauth
    .logout()
    .then(() => setUser(undefined))
    .catch((err)=> {
  
        console.log(error)
    })
  
  };

  
  
  useEffect(() => {
    uauth
    .user()
    .then(setUser)
    .catch(() => {})
   
  }, [setUser]);

  // Return the user object and auth methods
  return {
    user,
    signin,
    signout    
  };
}