import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [votesArray, setVotesArray] = useState(Array(anecdotes.length).fill(0))

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


  const voteSelectedAnecdote = () => {
    const votesArrayCopy = [...votesArray]
    votesArrayCopy[selectedIndex] += 1
    setVotesArray(votesArrayCopy)
  }

  return (
    <div>
      <h1>Anecdote</h1>
      <p>{anecdotes[selectedIndex]}</p>
      <p>has {votesArray[selectedIndex]} votes</p>
      <button onClick={() => voteSelectedAnecdote()}>vote</button>
      <button
        onClick={() => setSelectedIndex(getRandomInt(anecdotes.length))}>
        next anecdote
      </button>
      <h1>Anecdote with most votes</h1>
      <p>
        {anecdotes[votesArray.indexOf(Math.max(...votesArray))]}
      </p>
    </div>
  )
}

export default App