import React, { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import { Persons } from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const personsToDisplay =
    persons.filter(person =>
      person.name
        .toLowerCase()
        .includes(nameFilter))


  const addName = (e) => {
    e.preventDefault()

    const newPerson = {
      id: persons.length + 1,
      name: newName,
      number: newNumber
    }

    if (persons.filter(person => person.name === newName).length === 0) {
      setPersons(persons.concat(newPerson))
    } else {
      alert(`${newName} is already added to phonebook`)
    }

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={nameFilter} setNameFilter={setNameFilter} />
      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        setName={setNewName}
        number={newNumber}
        setNumber={setNewNumber}
        handleSubmit={addName}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToDisplay} />
    </div>
  )
}

export default App