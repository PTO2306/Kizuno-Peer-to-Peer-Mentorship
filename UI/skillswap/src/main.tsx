import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
