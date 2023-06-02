const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('type', function(req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

let persons = [
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

app.get('/', (request, response) => {
    response.send('<h1>Hell owrld </h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id =  Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
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

    const newPerson = {
        name: person.name,
        number: person.number,
        id: newId
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.get('/api/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people<br/>
        ${new Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log((`Server running on port ${PORT}`))
})
