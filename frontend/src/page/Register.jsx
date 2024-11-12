import { useState } from 'react';
import axios from 'axios';
import BACKEND_PORT from '../../backend.config.json';
import { TextField, Button, Typography, Box } from '@mui/material';
import PopupModal from '../component/PopupModal';

function Register({handleSuccess}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const register = () => {
    if (!email || !password || !name) {
      setErrorMessage('Please fill in all fields');
      setIsErrorModalOpen(true);
      return;
    }
    axios.post(`http://localhost:${BACKEND_PORT.BACKEND_PORT}/admin/auth/register`, {
      email: email,
      password: password,
      name: name,
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
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h4" component="h2" align="center">
          Register
        </Typography>

        <TextField
          label="Name"
          type="text"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

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
          onClick={register}
          fullWidth
        >
          Register
        </Button>
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

export default Register
