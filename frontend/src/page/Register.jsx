import { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const register = () => {
    console.log('registering:')
    console.log(email, password, name);
  }

  return (
    <>
      <h2>Register</h2>
      Email:
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      Password:
      <input
        type="text"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br />
      Name:
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <br />
      <button onClick={register}>Register</button>
    </>
  )
}

export default Register
