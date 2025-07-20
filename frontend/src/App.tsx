import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Chats from './pages/Chats'
import Profile from './pages/Profile'
import Verified from './pages/Verified'


function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/verify-email' element={<Verified/>}/>
        <Route path='/signup' element={<SignUp /> }/>
        <Route path='/chats' element={<Chats />} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </main>
  )
}

export default App
