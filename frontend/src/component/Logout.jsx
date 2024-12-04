import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import BACKEND_PORT from "../../backend.config.json";
import LogoutIcon from "@mui/icons-material/Logout";

const Logout = ({token, setToken}) => {
  const navigate = useNavigate();
  
  const logout = () => {
    console.log("logout");
    axios.post(`http://localhost:${BACKEND_PORT.BACKEND_PORT}/admin/auth/logout`, {},
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        // logs out by removing token and redirecting to login page
        localStorage.removeItem("token");
        setToken(undefined);
        navigate("/login");
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
