import React, { useState } from 'react';
import { Navigate, useLocation, Routes, Route, Link, useNavigate } from 'react-router-dom';

import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import Logout from './component/Logout';

function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleNewToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    navigate('/dashboard');
  }

  React.useEffect(() => {
    if (token && ['/login', '/register'].includes(location.pathname)) {
      navigate('/dashboard');
    } if (!token && !(['/login', '/register'].includes(location.pathname))) {
      navigate('/login');
    }
  }, [token, location.pathname]);
  return (
    <>
      <div>
        {token ? (<> <Link to="/dashboard">Dashboard</Link></>
        ) : (
          <>
            <Link to="/register">Register</Link>
            &nbsp;|&nbsp;
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/register" element={<Register handleSuccess={handleNewToken} />} />
        <Route path="/login" element={<Login handleSuccess={handleNewToken} />} />
      </Routes>
      {token && (
        <>
          <hr />
          <Logout token={token} setToken={setToken} />
        </>
      )}
    </>
  )
}
export default App