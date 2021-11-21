
// Header componenet
const Header = ({ title }) => <h1>{title}</h1>

// Part component
const Part = ({ partName, exerciseCount }) => <p> {partName} {exerciseCount}</p>

// Content component
const Content = ({ parts }) => {
  return (
    <>
      <Part partName={parts[0].name} exerciseCount={parts[0].exercises} />
      <Part partName={parts[1].name} exerciseCount={parts[1].exercises} />
      <Part partName={parts[2].name} exerciseCount={parts[2].exercises} />
    </>
  )
}

// Total Exercises component
const Total = ({ parts }) => {
  let totalExercists = 0
  parts.forEach(element => {
    totalExercists = totalExercists + element.exercises
  });
  return <p>Number of exercises {totalExercists}</p>
}

// Root application component
const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [{
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }]
  }
  return (
    <div>
      <Header title={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App;
