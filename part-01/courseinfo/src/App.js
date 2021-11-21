const Header = ({ title }) => <h1>{title}</h1>
const Part = ({ partName, exerciseCount }) => <p> {partName} {exerciseCount}</p>
const Total = ({ totalExerciseCount }) =>
  <p>Number of exercises {totalExerciseCount}</p>

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header title={course} />
      <Part partName={part1} exerciseCount={exercises1} />
      <Part partName={part2} exerciseCount={exercises2} />
      <Part partName={part3} exerciseCount={exercises3} />
      <Total totalExerciseCount={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App;
