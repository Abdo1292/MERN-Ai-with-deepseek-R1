import { Box, Button, Typography } from "@mui/material"
import  CustomizedInput  from "../components/shared/CustomizedInput"
import { IoIosLogIn } from 'react-icons/io'
import  { toast } from 'react-hot-toast'
import { useAuth } from "../context/AuthContext"

import { useNavigate } from "react-router-dom"
const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth()!;

  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();   
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      try{
        toast.loading("logging in", { id: "login" })
        await login(email, password)
        toast.success("logged in successfuly", { id: "login" })
        navigate("/")
      }catch(err){
        toast.error("Login Error:", { id: "login" })
        console.log(err)
      }
  }

  return (
    <Box width={"100%"} height={"100%"} display={"flex"} flex={1}>
       <Box padding={3} mt={8} display={{md:"flex", sm: "none", xs: "none"}}>
        <img src="airobot.png" alt="Robot" style={{width: "300px"}}/>
       </Box>
       <Box 
        display={"flex"} 
        flex={{ xs: 1, md: 0.5 }} 
        justifyContent={"center"} 
        alignItems={"center"} 
        padding={2} 
        ml={"auto"}
        mt={16}
       >
         <form 
         onSubmit={handleSubmit}
         style={{
          margin: "auto", 
          padding: "30px", 
          boxShadow: "10px 10px 20px #000", 
          borderRadius: "10px", 
          border: "none"
          }}>
            <Box 
            sx={{ 
             display: "flex", 
             flexDirection: "column", 
             justifyContent: "center" 
             }}>
              <Typography 
              variant="h4" 
              textAlign="center" 
              padding={2} 
              fontWeight={600}
              >
                 Login
              </Typography>
              <CustomizedInput type="email" name="email" label="email" autoComplete="off"/>
              <CustomizedInput type="password" name="password" label="password" autoComplete="off"/>
             </Box>
             <Button
              type="submit" 
             sx={{
              px:2,
              py:1,
              mt:2,
              width:"400px", 
              borderRadius:2,
              color:"white",
              bgcolor:"rgb(0,0,130)",
              ":hover":{
                bgcolor:"rgb(0,0,300)",
                color:"black"
              },
              transition: 'all',
              transitionDuration:'500ms'
             }}
             endIcon={<IoIosLogIn/>} 
             > Login </Button>
         </form>
       </Box>
    </Box>
  )
}

export default Login
