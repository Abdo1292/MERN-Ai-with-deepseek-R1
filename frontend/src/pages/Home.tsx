import { Box, Typography, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GlobalStyles } from "@mui/material";

const randomMoveKeyframes = `
@keyframes randomMove {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(50vw, 10vh);
  }
  50% {
    transform: translate(-10vw, 50vh);
  }
  75% {
    transform: translate(40vw, 10vh);
  }
  100% {
    transform: translate(0, 0);
  }
}
`;

const Home = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  return (
   <>
   <GlobalStyles styles={randomMoveKeyframes} />

     <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}> 
     {Array.from({ length: 70 }).map((_, i) => (
    <Box
      key={i}
      sx={{
        width: "7px",
        height: "7px",
        bgcolor: "white",
        borderRadius: "20px",
        boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.5)",
        opacity: 0.5,
        zIndex: 0,
        position: "absolute",
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        animation: `randomMove ${30 + Math.random() * 60}s linear infinite`,
        animationDelay: `${Math.random() * 10}s`
      }}
    />
  ))}
       <Typography
          variant="h3"
          fontWeight={700}
          gutterBottom  
          sx={{
           background: "linear-gradient(270deg, #001f3f, #4B0082, #001f3f)",  // loop the colors
           backgroundSize: "600% 600%",  
           WebkitBackgroundClip: "text",
           WebkitTextFillColor: "transparent",
           animation: "gradientShift 10s linear infinite",
           zIndex:1
         }}
        >
           Welcome to DeepSeek Chat
       </Typography>
       <Typography variant="h6" color="white" >
         Your AI assistant for seamless conversations and productivity.
       </Typography>
    
       <Box sx={{ mt: 4 }}>
    
         {auth?.isLoggedIn ?  (  
         <>
              <Button
             variant="contained"
             color="primary"
             size="large"
             onClick={() => navigate('/chats')}
             sx={{":hover" : {
               color: "black"
             },
              transition: "all 0.5s ease",
              mr: 2,
              zIndex:2,
             }}
           >
             Go to Chat
           </Button>
           <Button
             variant="outlined"
             color="primary"
             size="large"
             sx={{":hover" : {
               color: "white"
             } ,
              transition: "all 0.5s ease",
              zIndex:2,
            }}
             onClick={() => navigate('/profile')}
           >
             Your Profile
           </Button>
          
         </>
           ) : (<>   
           <Button
             variant="contained"
             color="primary"
             size="large"
             onClick={() => navigate('/login')}
             sx={{":hover" : {
               color: "black"
             },
              transition: "all 0.5s ease",
              mr: 2
             }}
           >
             Login
           </Button>
           <Button
             variant="outlined"
             color="primary"
             size="large"
             sx={{":hover" : {
               color: "white"
             } ,
              transition: "all 0.5s ease"}}
             onClick={() => navigate('/signup')}
           >
             SignUp
           </Button></>) }
      </Box>
       <Box sx={{ mt:35, opacity: 0.4 }}>
         <Typography variant="body1" color="white.secondary">
           Developed by Abdelrahman Ramadan <br/> • Powered by DeepSeek AI
         </Typography>
       </Box>
     </Container>
   </>
  )
}

export default Home