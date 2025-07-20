import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider} from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { AuthProvider } from './context/AuthContext.tsx'
import { Toaster } from 'react-hot-toast'
import { ImageProvider } from './context/ImageContext.tsx'


axios.defaults.baseURL = 'http://localhost:5000/api/v1'
axios.defaults.withCredentials = true;
const theme = createTheme({
  typography: {
    fontFamily: "Roboto Slab, serif",
    allVariants: { color: "white" } 
  }
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <ImageProvider>
       <BrowserRouter>
         <AuthProvider>
          <ThemeProvider theme={theme}>
           <Toaster position='top-right'/>
             <App />
           </ThemeProvider>
         </AuthProvider>
       </BrowserRouter>
  </ImageProvider>
  </StrictMode>,
)
