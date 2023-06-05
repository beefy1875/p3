require('dotenv').config()   
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('type', function(req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.get('/', (request, response) => {
    response.send('<h1>Hell owrld </h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person => person.id !== id)

    response.status(204).end()

})

app.post('/api/persons', (request, response) => {
    const person = request.body
    const newId = Math.floor(Math.random() * 100000)

    if(!person.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if(!person.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if(persons.find(p => p.name === person.name)) {
        return response.status(400).json({
            error: 'person already exists'
        })
    }

    const newPerson = new Person({
        name: person.name,
        number: person.number,
        id: newId
    })

    newPerson.save().then(savedPerson => {
        response.json(newPerson)
    })

})

app.get('/api/info', (request, response) => {
    response.send(`Phonebook has info for {Person.length} people<br/>
        ${new Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log((`Server running on port ${PORT}`))
})
