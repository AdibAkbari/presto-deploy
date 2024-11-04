import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = ({token, setToken}) => {
  const navigate = useNavigate();

  const logout = () => {
    console.log('logout');
    axios.post('http://localhost:5005/admin/auth/logout', {},
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        localStorage.removeItem('token');
        setToken(undefined);
        navigate('/login');
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  }

  return <button onClick={logout}>Logout</button>;
}

export default Logout;
