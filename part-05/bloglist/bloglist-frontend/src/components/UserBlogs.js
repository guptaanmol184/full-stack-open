import Blog from './Blog'

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

export default UserBlogs