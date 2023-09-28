const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.json())

morgan.token('type', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

let phonebook = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(phonebook)
})

app.get('/info', (req, res) => {
    const toReturn = `Phonebook has info for ${phonebook.length} people</br>${Date()}`
    res.send(toReturn)
})

app.get('/api/persons/:id', (req, res) => {
    const personToReturn = phonebook.find(person => person.id === Number(req.params.id))
    if (personToReturn) {
        res.send(personToReturn)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    phonebook = phonebook.filter(person => person.id !== Number(req.params.id))

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (phonebook.find(person => person.name === req.body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const person = {"id": Math.floor(Math.random() * 10000), ...req.body}
    phonebook = phonebook.concat(person)

    res.json(person)
})

const unKnownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unKnownEndpoint)

app.listen(3001)