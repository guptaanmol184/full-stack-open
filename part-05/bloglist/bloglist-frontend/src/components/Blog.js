import React, { useState } from 'react'
const Blog = (
  {
    blog,
    handleUpdateBlogLikeCount,
    handleDeleteBlog
  }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleIsExpanded = () => setIsExpanded(!isExpanded)

  const handleLikeButtonClicked = () => {
    handleUpdateBlogLikeCount(blog.id, blog.likes + 1)
  }

  const handleDeleteButtonClicked = () => {

    const confirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (confirmation) {
      handleDeleteBlog(blog.id)
    }
  }

  const blogBody = () => {
    return (
      <>
        <p>Url: <a href={blog.url}>{blog.url}</a></p>
        <p>Likes: {blog.likes} <button onClick={handleLikeButtonClicked}>like</button></p>
        <p>Author: {blog.author} </p>
        <button onClick={handleDeleteButtonClicked}>remove</button>
      </>
    )
  }


  return (
    < div style={blogStyle}>
      <p>Title: {blog.title} <button onClick={toggleIsExpanded}>{isExpanded ? 'hide' : 'view'}</button> </p>
      {
        isExpanded && blogBody()
      }
    </div >
  )
}

export default Blog