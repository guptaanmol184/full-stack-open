
const Header = ({ course }) => {
    return (
        <h1>{course.name}</h1>
    )
}

const Total = ({ course }) => {
    const sum = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <p>Number of exercises {sum}</p>
    )
}

const Part = (props) => {
    return (
        <p>
            {props.part.name} {props.part.exercises}
        </p>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course} />
            {
                course.parts.map((part) => <Part key={part.id} part={part} />)
            }
            <Total course={course} />
        </div>
    )
}

export default Course