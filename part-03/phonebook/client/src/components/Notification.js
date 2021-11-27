const Notification = ({ notification }) => {
  const { message, type } = notification

  if (message === null) {
    return null
  }

  if (type === 'error') {
    return (
      <div className="error">
        {message}
      </div>
    )
  } else if (type === 'info') {
    return (
      <div className="info">
        {message}
      </div>
    )
  }
}

export default Notification