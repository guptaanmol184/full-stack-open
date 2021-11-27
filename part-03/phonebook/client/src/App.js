import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/persons'
import PersonForm from './components/PersonForm'
import { Persons } from './components/Persons'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

  const sendNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 3000);
  }

  // Initialize persons from backend
  useEffect(() => {
    personService
      .getAllPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log('Populating persons failed: ', error)
        sendNotification(`Failed to retrieve people from server: ${error.response.data.error}`, 'error')
      })
  }, [])

  // Person Filtering
  const personsToDisplay =
    persons.filter(person =>
      person.name
        .toLowerCase()
        .includes(nameFilter))

  // Create (or) Update new Person
  const addName = (e) => {
    e.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson === undefined) {
      personService.createPerson(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          sendNotification(`Added ${createdPerson.name}`, 'info')
        })
        .catch(error => {
            console.log(`Server returned error: ${error}`);
            console.log({error})
            sendNotification(error.response.data.error, 'error')
        })
    } else {
      const updateConfirmation =
        window.confirm(`${newName} is already added to phonebook, replace the old number with a new one ?`)
      if (updateConfirmation) {
        personService.updatePerson(existingPerson.id, newPerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => {
              return person.id === existingPerson.id
                ? updatedPerson
                : person
            }))
            sendNotification(`Updated ${existingPerson.name}`, 'info')
          })
          .catch(error => {
            console.log(`Server returned error: ${error}`);
            //alert(`Server was unable to update ${existingPerson.name}. Please refresh to fetch latest information from the server.`)
            sendNotification(`Server failed to update information for ${existingPerson.name}. Error: ${error.response.data.error}. Please refresh to proceed.`,
              'error')
          })
      }
    }

    setNewName('')
    setNewNumber('')
  }

  // Delete Person
  const deletePerson = (personToDelete) => {
    const confirmation = window.confirm(`Delete ${personToDelete.name} ?`)

    if (confirmation) {
      personService.deletePerson(personToDelete.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== personToDelete.id))
        })
        .catch(error => {
          console.log(`Server returned error: ${error}`);
          //alert(`The person ${personToDelete.name} was already deleted from server.`)
          sendNotification(`Information for ${personToDelete.name} has been removed from the server.`,
            'error')
          setPersons(persons.filter(p => p.id !== personToDelete.id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        notification={notification} />
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
      <Persons persons={personsToDisplay} onDeletePerson={deletePerson} />
    </div>
  )
}

export default App