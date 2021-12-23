import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import AddBlogForm from './AddBlogForm'

describe('<AddBlogForm />', () => {

  test('<AddBlogForm /> updates state appropriately and calls method to add new blog', () => {

    const mockHandleAddButtonClick = jest.fn()

    const component = render(
      <AddBlogForm handleAddBlog={mockHandleAddButtonClick} />
    )

    const newBlog = {
      title: 'New Blog Title',
      author: 'New Blot Author',
      url: 'New Blog Url'
    }

    const blogTitleInput = component.container.querySelector('input[name="blogTitle"]')
    const blogAuthorInput = component.container.querySelector('input[name="blogAuthor"')
    const blogUrlInput = component.container.querySelector('input[name="blogUrl"]')
    const addBlogForm = component.container.querySelector('form')

    fireEvent.change(blogTitleInput, {
      target: {
        value: newBlog.title
      }
    })

    fireEvent.change(blogAuthorInput, {
      target: {
        value: newBlog.author
      }
    })

    fireEvent.change(blogUrlInput, {
      target: {
        value: newBlog.url
      }
    })

    fireEvent.submit(addBlogForm)

    expect(mockHandleAddButtonClick.mock.calls).toHaveLength(1)
    expect(mockHandleAddButtonClick.mock.calls[0][0]).toEqual(newBlog)
  })
})