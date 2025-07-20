import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import {
  checkAuthStatus,
  
  loginUser,
  logoutUser,
  signupUser,
  verifyEmailWithToken,
} from "../helpers/ApiCommunicator";
import { useNavigate } from "react-router-dom";

type User = {
  name: string;
  email: string;
  verified: boolean;
  isLoggedIn: boolean;
};

type UserAuth = {
  isLoggedIn: boolean;
  isVerified: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  markUserVerified: () => void;
  markUserNotVerified: () => void;
  markUserLoggedIn: () => void;
  markUserNotLoggedIn: () => void
  checkUserLoggedInStatus: () => Promise<void>;
  checkUserIsVerifiedStatus: (token:string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  

  const checkUserLoggedInStatus = async () => {
    const data = await checkAuthStatus();
    try {
      if(data){
        setUser({name: data.name, email: data.email, verified: data.verified, isLoggedIn: data.isLoggedIn})
        setIsLoggedIn(true)
       }
    } catch (err) {
      console.log(err)
    }
    
  }

  useEffect(() => {
    checkUserLoggedInStatus()
  },[])

  
  const checkUserIsVerifiedStatus = async (token:string) => {
    const data = await verifyEmailWithToken(token);
    try {
      if(data){
        setUser({name: data.name, email: data.email, verified: data.verified, isLoggedIn: data.isLoggedIn})
        setIsVerified(data.Verified)
       }
    } catch (err) {
      console.log(err)
    }
    
  }

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    if (data) {
    setUser({
        email: data.email,
        name: data.name,
        verified: data.verified,
        isLoggedIn: data.isLoggedIn,
      });
      setIsLoggedIn(true);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await signupUser(name, email, password);
    if (data) {
      setUser({
        name: data.name,
        email: data.email,
        verified: data.verified,
        isLoggedIn: data.isLoggedIn,
      });
      setIsLoggedIn(data.isLoggedIn);
      setIsVerified(data.verified);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err){
      console.log(err);
    } finally {
      setUser(null);
      markUserNotLoggedIn();
      markUserNotVerified();
      navigate("/")
      
    }
  };

  const markUserVerified = () => {
    setIsVerified(true);
    setUser((prev) => (prev ? { ...prev, verified: true } : prev));
  };

  const markUserNotVerified = () => {
    setIsVerified(false);
   
  };
  
  const markUserNotLoggedIn = () => {
    setIsLoggedIn(false);
    setUser((prev) => (prev ? { ...prev, isLoggedIn: false } : prev));
  }

  const markUserLoggedIn = () => {
    setIsLoggedIn(true);
    setUser((prev) => (prev ? { ...prev, isLoggedIn: true } : prev));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isVerified,
        login,
        signup,
        logout,
        markUserVerified,
        markUserNotVerified,
        markUserLoggedIn,
        markUserNotLoggedIn,
        checkUserIsVerifiedStatus,
        checkUserLoggedInStatus,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);