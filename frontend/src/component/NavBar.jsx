import { Box, Button, AppBar, Typography, Toolbar} from "@mui/material";
import { Link } from "react-router-dom";
import Logout from "./Logout";

const NavBar = ({ token, setToken }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Presto
        </Typography>
        <Box sx={{ flexGrow: 39 }}>
          {token ? (
            <>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between"
              }}>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Logout token={token} setToken={setToken} />
              </Box>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;