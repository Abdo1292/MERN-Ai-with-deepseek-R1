import { Box, Typography } from "@mui/material"
import { useAuth } from "../context/AuthContext"
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
    transform: translate(-50vw, 70vh);
  }
  75% {
    transform: translate(80vw, 20vh);
  }
  100% {
    transform: translate(0, 0);
  }
}
`;

const Profile = () => {

   const auth = useAuth();

  return (<>
    <GlobalStyles styles={randomMoveKeyframes} />

  
    {Array.from({ length: 100 }).map((_, i) => (
   <Box
     key={i}
     sx={{
       width: "4px",
       height: "4px",
       bgcolor: "white",
       borderRadius: "20px",
       boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.5)",
       opacity: 0.5,
       zIndex: 0,
       position: "absolute",
       top: `${Math.random() * 100}vh`,
       left: `${Math.random() * 100}vw`,
       animation: `randomMove ${30 + Math.random() * 60}s linear infinite`,
       animationDelay: `${Math.random() * 5}s`
     }}
   />
 ))}
    <Box sx={{height: "100dvh", 
    width:"100vw", 
    overflow: "hidden" ,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    zIndex:1,
    }}>
<Box
  sx={{
    height: "400px",
    width: "300px",
    borderRadius: "40px",
    background: "linear-gradient(90deg, #001f3f, #001d4e)",
    boxShadow: "0 4px 20px rgba(1,10,20,0.8)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex:2,
    p: 2,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.5)"
    }
  }}
>
  <Box
    sx={{
      width: 80,
      height: 80,
      borderRadius: "50%",
      overflow: "hidden",
      mb: 2,
      border: "2px solid rgba(255,255,255,0.2)"
    }}
  >
    <Box
     sx={{ width: "100%",
         height: "100%", 
         objectFit: "cover",
         display:"flex",
         justifyContent:"center",
         alignItems:"center"
        }}
    >
        <span style={{
            fontWeight:"bold",
            fontSize:"30px"
        }}>
          {auth?.user?.name[0]}
        </span>
        
    </Box>
  </Box>
  
  <Typography variant="h6" sx={{ fontWeight: 700 }}>
    Name: {auth?.user?.name}
  </Typography>
  
  <Typography variant="h6" sx={{ fontWeight: 700, mb:"50px" }}>
     Email: {auth?.user?.email}
  </Typography>
  

     </Box>
    </Box>

    </>
  )
}

export default Profile
