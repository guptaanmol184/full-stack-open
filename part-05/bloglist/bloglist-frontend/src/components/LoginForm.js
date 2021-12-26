import React, { useState } from 'react'
import PropTypes from 'prop-types'

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
          id='username'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        <label>Password: </label>
        <input type='password'
          id='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type='submit'>
        login
      </button>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm