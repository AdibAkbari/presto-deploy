import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';
import BACKEND_PORT from '../../backend.config.json';
import { Link } from 'react-router-dom';
import PopupModal from '../component/PopupModal';

const Login = ({handleSuccess}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // logs in with email and password from inputs and adds token using handleSuccess
  const login = () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      setIsErrorModalOpen(true);
      return;
    }
    axios.post(`http://localhost:${BACKEND_PORT.BACKEND_PORT}/admin/auth/login`, {
      email: email,
      password: password
    })
      .then((response) => {
        handleSuccess(response.data.token);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        setIsErrorModalOpen(true);
      });
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 400,
          margin: 'auto',
          mt: 4,
          px: 2
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h4" component="h2" align="center">
          Login
        </Typography>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          onClick={login}
          fullWidth
        >
          Login
        </Button>
        <Box textAlign='center'>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            color="inherit"
            sx={{
              width: "80%",
              height: "50%"
            }}
          >
            {/* Sends user to register page if they don't have an account */}
            <Typography textTransform={'none'} sx={{fontSize: '0.9rem'}}>
              Don&apos;t have an account? Register here
            </Typography>
          </Button>
        </Box>
      </Box>
      <PopupModal
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        instruction={errorMessage}
        onSubmit={() => setIsErrorModalOpen(false)}
        confirmMsg="OK"
      />
    </>
  )
}

export default Login
