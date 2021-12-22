import Blog from './Blog'
import PropTypes, { object } from 'prop-types'
import React from 'react'

const UserBlogs =
  (
    {
      userBlogList,
      handleUpdateBlogLikeCount,
      handleDeleteBlog
    }
  ) => {
    return (
      userBlogList.length === 0
        ? <p>You have not added any blogs.</p>
        : userBlogList
          .map(blog =>
            <Blog key={blog.id}
              blog={blog}
              handleUpdateBlogLikeCount={handleUpdateBlogLikeCount}
              handleDeleteBlog={handleDeleteBlog}
            />
          )
    )
  }

UserBlogs.propTypes = {
  userBlogList: PropTypes.arrayOf(object).isRequired,
  handleUpdateBlogLikeCount: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired
}

export default UserBlogs