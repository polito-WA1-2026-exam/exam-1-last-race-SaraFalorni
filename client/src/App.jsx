import './App.css'
import {useState, useEffect} from 'react';
import {Routes, Route, Navigate } from 'react-router';
import {Container} from 'react-bootstrap';
import API from './API.js';
import NavHeader from './components/NavHeader.jsx';
import HomePage from './components/HomePage.jsx';
import RankingPage from './components/RankingPage.jsx';
import GamePage from './components/GamePage.jsx';
import {LoginForm} from './components/Auth.jsx';

function App() {
  const [user, setUser] = useState(null); //null is not logged in
  const [loading, setLoading] = useState(true);

  //checks if logged in (once)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await API.getUserInfo();
        setUser(userInfo);
      } catch {
        setUser(null); //no session == not logged in
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []); 

  const handleLogin = async (credentials) => {
    const userInfo = await API.logIn(credentials);
    setUser(userInfo);
  };

    const handleLogout = async () => {
      await API.logOut();
      setUser(null);
  };

  return (<> 
    <NavHeader user={user} logout={handleLogout}/>
      <Container className='mt-3'>
        {loading ? (<p>loading...</p>) :
          (<Routes>
            <Route path="/" element={<HomePage user={user} />}/>
            <Route path="/login" element={<LoginForm login={handleLogin} />}/>
            <Route path="/ranking" element={user ? <RankingPage/> : <Navigate to="/login" replace />}/>
            <Route path="/game" element={user ? <GamePage/> : <Navigate to="/login" replace />}/>
            <Route path="*" element={<Navigate to="/" replace />}/>
          </Routes>)
        }
      </Container>
  </>); 
}

export default App;
