import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

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
        console.log(error);
      });
  }

  return <Button
    variant="outlined"
    color="white"
    startIcon={<LogoutIcon />}
    onClick={logout}
  >
    Logout
  </Button>;
}

export default Logout;
