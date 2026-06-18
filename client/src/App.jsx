import './App.css'
import {UseState} from 'react';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router';
import {Container} from 'react-bootstrap';
import NavHeader from './components/NavHeader.jsx';
import HomePage from './components/HomePage.jsx';

function App() {
  return (<> 
  <BrowserRouter>
    <NavHeader>
      <Container class='mt-3'>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="*" element={<Navigate to="/" replace />}/>
        </Routes>
      </Container>
    </NavHeader>
  </BrowserRouter>
  </>); 
}

export default App;
