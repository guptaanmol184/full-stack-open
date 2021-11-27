const mongoose = require('mongoose')

let password = ''
let name = ''
let number = ''

// Extract arguments
// Validate required arguments
if(process.argv.length === 5) {
    password = process.argv[2]
    name = process.argv[3]
    number = process.argv[4]
} else if (process.argv.length === 3) {
    password = process.argv[2]
} else {
    console.log('To add a new person: ')
    console.log('\tUsage: node mongo.js <mongo-db-password> <Person Name> <Person Phone Number>')
    console.log('\n')
    console.log('To retrieve information of all added people: ')
    console.log('\tUsage: node mongo.js <mongo-db-password> <Person Name> <Person Phone Number>')
    process.exit(1)
}

const dbName = 'persons-app'
const url = `mongodb+srv://fso-ag-admin:${password}@fso-21-cluster.byjiz.mongodb.net/${dbName}?retryWrites=true`

// connect to mongo db hosted on the cloud
mongoose.connect(url)

// Define person schema and model
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

// If name and number are defined
if (name !== '' && number !== '') {
    // Add new person to the db
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    // Show all persons from the db
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
