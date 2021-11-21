import React, { useState } from 'react'

const Button = ({ text, handleClick }) =>
  <button onClick={handleClick}>{text}</button>

const StatisticLine =
  ({ text, value }) => (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )

const Statistics = ({ good = 0, bad = 0, neutral = 0 }) => {

  const getAverage = (good, neutral, bad) => {
    const GOOD_WEIGHT = 1
    const NEUTRAL_WEIGHT = 0
    const BAD_WEIGHT = -1

    const weightedScore = ((good * GOOD_WEIGHT) + (neutral * NEUTRAL_WEIGHT) + (bad * BAD_WEIGHT))
    const totalObservations = (good + neutral + bad)

    return totalObservations === 0 ?
      0 : weightedScore / totalObservations
  }

  const getPositivePercent = (good, neutral, bad) => {
    const totalObservations = (good + neutral + bad)

    return totalObservations === 0 ?
      0 : (good / totalObservations) * 100
  }

  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <>
        <h1>Statistics</h1>
        <p>No feedback provided.</p>
      </>
    )
  }

  return (
    <>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text='Good count: ' value={good} />
          <StatisticLine text='Neutral count: ' value={neutral} />
          <StatisticLine text='Bad count: ' value={bad} />
          <StatisticLine text='All count:' value={good + neutral + bad} />
          <StatisticLine text='Average: ' value={getAverage(good, neutral, bad)} />
          <StatisticLine text='Positive Percent:' value={getPositivePercent(good, neutral, bad) + '%'} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button
        text='Good'
        handleClick={() => setGood(good + 1)} />
      <Button
        text='Neutral'
        handleClick={() => setNeutral(neutral + 1)} />
      <Button
        text='Bad'
        handleClick={() => setBad(bad + 1)} />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad} />
    </div>
  )
}

export default App