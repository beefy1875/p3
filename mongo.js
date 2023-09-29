const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as an argument')
    process.exit(1)
}

const pwd = process.argv[2]
const url = `mongodb+srv://beefy1875:${pwd}@cluster0.h93wm0x.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)
        
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(persons => {
        console.log('phonebook:')
        persons.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else {

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(savedPerson => {
        console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
        mongoose.connection.close()
    })
}