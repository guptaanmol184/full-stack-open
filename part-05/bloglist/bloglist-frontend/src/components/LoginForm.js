import { useState } from "react";

const LoginForm = ({
  handleLogin
}) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const loginClicked = (e) => {
    e.preventDefault()
    handleLogin(username, password)

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={loginClicked}>
      <div>
        <label>Username: </label>
        <input type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        <label>Password: </label>
        <input type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>
        login
      </button>
    </form>
  )
}

export default LoginForm