import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = () => {
    console.log('logging in:')
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
