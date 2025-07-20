import { AppBar, Toolbar, Button } from '@mui/material'
import Logo from './shared/Logo'
import { useAuth } from '../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'


const Header = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
 if(location.pathname === "/" || location.pathname==="/verify-email"){
   return null;
  } 
  return (
    <AppBar sx=
       {
        { 
          bgcolor: "transparent", 
          position: "static", 
          boxShadow: "none"
         }
        }>
         <Toolbar sx={{display: "flex", }}>
            <Logo/>
            <div>
              {auth?.isLoggedIn ?
              (
               <>
                       
            <Button
             variant="outlined"
             color="primary"
             size="large"
             sx={{":hover" : {
               color: "white",
             } ,
              borderRadius:"20px",
              transition: "all 0.5s ease",
              zIndex:2,
            }}
             onClick={() => navigate('/chats')}
           >
             Go to Chat
           </Button>
           <Button
             variant="outlined"
             
             size="large"
             sx={{":hover" : {
               color: "white",
               borderColor:"rgb(200,0,0)",
             } ,
              color:"rgb(180,0,0)",
              borderColor:"rgb(130,0,0)",
              borderRadius:"20px",
              ml:"10px",
              transition: "all 0.5s ease",
              zIndex:2,
            }}
             onClick={auth?.logout}
           >
             Logout
           </Button>
                  
                </>
              ):(
              <>
          <Button
             variant="outlined"
             color="primary"
             size="large"
             sx={{":hover" : {
               color: "white",
             } ,
              borderRadius:"20px",
              transition: "all 0.5s ease",
              zIndex:2,
            }}
             onClick={() => navigate('/login')}
           >
             Login
           </Button>
           <Button
             variant="outlined"  
             size="large"
             sx={{":hover" : {
               color: "white",
               borderColor:"rgb(0,200,0)",
             } ,
              color:"rgb(0,180,0)",
              borderColor:"rgb(0,130,0)",
              borderRadius:"20px",
              ml:"10px",
              transition: "all 0.5s ease",
              zIndex:2,
            }}
             onClick={() => navigate("/signup")}
           >
             SignUp
           </Button>
              </>
              )
                }
          
            </div>
         </Toolbar>
    </AppBar>
  )
}

export default Header
