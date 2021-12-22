import React, { useState } from 'react'


const AddBlogForm = ({ handleAddBlog }) => {

  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleAddButtonClick = (e) => {
    e.preventDefault()

    const blog = { author: blogAuthor, title: blogTitle, url: blogUrl }

    handleAddBlog(blog)

    setBlogAuthor('')
    setBlogTitle('')
    setBlogUrl('')
  }

  return (
    <form onSubmit={handleAddButtonClick}>
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
  )
}

export default AddBlogForm