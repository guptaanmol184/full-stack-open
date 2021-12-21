import React, { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import UserBlogs from './components/UserBlogs'
import AddBlogForm from './components/AddBlogForm'
import Togglable from './components/Togglable'

const LOGGED_IN_USER_KEY = 'loggedInUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

  const addBlogFormRef = useRef()

  // Global function to display notifications to the user
  const sendNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 3000);
  }

  // Set's all blogs from backend
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  // Logs in the user using the localStorage
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem(LOGGED_IN_USER_KEY)
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Handles logging in the user
  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      console.log('Failed to login', exception)
      sendNotification('Invalid credentials, kindly recheck and try again', 'error')
    }
  }

  // Handles adding blog for the user
  const handleAddBlog = async (blogToAdd) => {
    try {
      // adding blog to db
      const createdBlog = await blogService.create(blogToAdd)
      sendNotification(`Successfully added blog titled ${blogToAdd.title}`, 'info')
      addBlogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(createdBlog))
    } catch (exception) {
      console.log('error adding blog', exception)
      sendNotification('Failed to add blog, please try again', 'error')
    }
  }

  // Handles updating blog like count
  const handleUpdateBlogLikeCount = async (blogId, updatedLikeCount) => {
    try {
      const blogToUpdate = blogs.find(blog => blog.id === blogId)
      const updatedBlog = { ...blogToUpdate, likes: updatedLikeCount, user: blogToUpdate.user.id }
      const udpatedBlogResponse = await blogService.update(blogId, updatedBlog)
      const newBlogList = blogs
        .map((blog) =>
          blog.id === blogId
            ? udpatedBlogResponse
            : blog
        )
      setBlogs(newBlogList)
    } catch {
      sendNotification('Error occured while liking blog', 'error')
    }
  }

  // Handles deleting the specified blog
  const handleDeleteBlog = async (blogId) => {
    try {
      await blogService.deleteBlog(blogId)
      const newBlogList = blogs.filter(blog => blog.id !== blogId)
      setBlogs(newBlogList)
    } catch {
      sendNotification('Error occured while deleting blog', 'error')
    }
  }

  // Handles logging out the user
  const handleLogout = (e) => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const loginPage = () => (
    <Togglable buttonLabel='login'>
      <LoginForm handleLogin={handleLogin} />
    </Togglable>)

  const userBlogPage = () => {

    const userBlogs = blogs
      .filter(blog => blog.user.username === user.username)

    userBlogs.sort((blog, otherBlog) => otherBlog.likes - blog.likes)

    return (
      <>
        <h2>{user.name}, you are logged in now!</h2>
        <button onClick={handleLogout}>logout</button>
        <h2>Blogs</h2>
        <UserBlogs
          userBlogList={userBlogs}
          handleUpdateBlogLikeCount={handleUpdateBlogLikeCount}
          handleDeleteBlog={handleDeleteBlog} />
        <h2>Add new blog</h2>
        <Togglable buttonLabel='Add new blog' ref={addBlogFormRef}>
          <AddBlogForm handleAddBlog={handleAddBlog} />
        </Togglable>
      </>
    )
  }

  return (
    <div>
      <h1 className='heading'>Blogs</h1>
      <Notification notification={notification} />
      {
        user == null
          ? loginPage()
          : userBlogPage()
      }
    </div >
  )
}

export default App