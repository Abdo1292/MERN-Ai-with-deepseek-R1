import axios from "axios"


export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(
    "/user/login",
    { email, password },
  );
  return res.data;
};


 export const signupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post("/user/signup", { name, email, password })
  if(res.status !== 200) {
    throw new Error("unable to signup")
  }
  const data = await res.data;
  return data;
 }
   
export const verifyEmailWithToken = async (token: string) => {
  try {
    const res = await axios.get(`/user/verify-email?token=${token}`);
    if (res.status !== 200) {
      throw new Error(res.data?.error || "Verification failed");
    }
    return res.data;
  } catch (error: any) {
    // More detailed error to surface frontend
    throw new Error(
      error.response?.data?.error || error.message || "Verification error"
    );
  }
};




 export const logoutUser = async () => {
   const res = await axios.post("/user/logout")
   if(res.status !== 200){
     throw new Error("unable to logout")
   }
   const data = await res.data;
   return data;
 }

export const checkAuthStatus = async () => {
  
    const res = await axios.get("/user/auth-status");
     if(res.status !== 200){
      throw new Error("unable to authenticate")
     }
    const data = await res.data
    return data;

 
};

export const sendChatRequest = async (message: string) => {
  const res = await axios
  .post("/chats/new",
     { message });
  if(res.status !== 200) {
    throw new Error("unable to send a message")
  }
  const data = await res.data;
  return data;
}


export const getUserChats = async () => {
  const res = await axios.get("/chats/all-chats");
   if(res.status !== 200) {
    throw new Error("unable to send chat")
   }
   const data = await res.data;
   return data;
}

export const deleteUserChats = async () => {
  const res = await axios.delete("/chats/delete-all-chats");
   if(res.status !== 200) {
    throw new Error("unable to send chat")
   }
   const data = await res.data;
   return data;
}