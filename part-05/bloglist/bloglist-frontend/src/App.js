import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

  const sendNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 3000);
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      console.log('Successfully logged in user:', user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Failed to login', exception)
      sendNotification('Invalid credentials, kindly recheck and try again', 'error')
    }
  }

  const handleAddBlog = async (e) => {
    e.preventDefault()
    console.log('adding blog with details')
    console.log('author', blogAuthor)
    console.log('title', blogTitle)
    console.log('url', blogUrl)

    try {
      // adding blog to db
      const createdBlog = await blogService.create({ author: blogAuthor, title: blogTitle, url: blogUrl })
      sendNotification(`Successfully added blog titled ${blogTitle}`, 'error')
      setBlogs(blogs.concat(createdBlog))
      console.log('success adding blog')
      setBlogAuthor('')
      setBlogTitle('')
      setBlogUrl('')
    } catch (exception) {
      console.log('error adding blog', exception)
      sendNotification('Failed to add blog, please try again', 'error')
    }
  }

  const handleLogout = (e) => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const loginForm = () => (
    <div>
      <h2>Log into the application</h2>
      <form onSubmit={handleLogin}>
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
    </div>
  )

  const userBlogs = () => {

    const userBlogs = blogs
      .filter(blog => blog.user.username === user.username)

    return (
      <>
        <h2>{user.name}, you are logged in now!</h2>
        <button onClick={handleLogout}>logout</button>
        <h2>Blogs</h2>
        {
          userBlogs.length === 0
            ? <p>You have not added any blogs.</p>
            : userBlogs
              .map(blog =>
                <Blog key={blog.id} blog={blog} />
              )}
        <h2>Add new blog</h2>
        <form onSubmit={handleAddBlog}>
          <div>
            <label>title:</label>
            <input
              name='blogTitle'
              value={blogTitle}
              onChange={({ target }) => setBlogTitle(target.value)}
            ></input>
          </div>
          <div>
            <label>author:</label>
            <input
              name='blogAuthor'
              value={blogAuthor}
              onChange={({ target }) => setBlogAuthor(target.value)}
            ></input>
          </div>
          <div>
            <label>url:</label>
            <input
              name='blogUrl'
              value={blogUrl}
              onChange={({ target }) => setBlogUrl(target.value)}
            ></input>
          </div>
          <button type='submit'>add</button>
        </form>
      </>
    )
  }

  return (
    <div>
      <h1 className='heading'>Blogs</h1>
      <Notification notification={notification} />
      {
        user == null
          ? loginForm()
          : userBlogs()
      }
    </div >
  )
}

export default App