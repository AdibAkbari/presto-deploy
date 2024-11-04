import { useState } from 'react';
import axios from 'axios';

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
      <h2>Login</h2>
      Email:
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}/>
      <br />
      Password:
      <input
        type="text"
        value={password}
        onChange={e => setPassword(e.target.value)}/><br />
      <button onClick={login}>Login</button>
    </>
  )
}

export default Login
