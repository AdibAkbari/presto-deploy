import React, { useState } from 'react';
import { Navigate, useLocation, Routes, Route, useNavigate } from 'react-router-dom';

import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import NavBar from './component/NavBar';
import Presentation from './page/Presentation';
import PreviewPresentation from './page/PreviewPresentation';

function Router() {
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();
  const previewingPresentation = location.pathname.includes('/preview/');

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
  }, [token, location.pathname, navigate]);
  return (
    <>
      {!previewingPresentation && 
        <div>
          <NavBar token={token} setToken={setToken} />
        </div>
      }
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/register" element={<Register handleSuccess={handleNewToken} />} />
        <Route path="/login" element={<Login handleSuccess={handleNewToken} />} />
        <Route path="/preview/:presentationId" element={<PreviewPresentation token={token} />} />
        {/* Nested routes for presentation and rearrange presentation */}
        <Route path="presentation/:presentationId/*" element={<Presentation token={token}/>} />
      </Routes>
    </>
  )
}
export default Router