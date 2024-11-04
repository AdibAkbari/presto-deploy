import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Login({handleSuccess}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = () => {
    console.log('logging in:')
    axios.post('http://localhost:5005/admin/auth/login', {
      email: email,
      password: password
    })
      .then((response) => {
        handleSuccess(response.data.token);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.error);
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
            <Typography textTransform={'none'} sx={{fontSize: '0.9rem'}}>
              Don&apos;t have an account? Register here
            </Typography>
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default Login
