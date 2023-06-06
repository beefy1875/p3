require('dotenv').config()   
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformed id'})
    }

    next(error)
}

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

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            console.log('a')
        })
        .catch(error => {
            next(error)
        })

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
    // if(persons.find(p => p.name === person.name)) {
    //     return response.status(400).json({
    //         error: 'person already exists'
    //     })
    // }

    const newPerson = new Person({
        name: person.name,
        number: person.number,
        id: newId
    })

    newPerson.save().then(savedPerson => {
        response.json(newPerson)
    })

})

app.put('/api/persons/:id', (req, response, next) => {
    console.log('putting')

    const body = req.body
    const person = {
        name: body.name,
        number: body.number,
    }

    console.log(person)
        
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


app.get('/api/info', async (request, response) => {
    const size = await Person.countDocuments({})
    console.log(size)
    response.send(`Phonebook has info for ${size} people<br/>${new Date()}`)
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log((`Server running on port ${PORT}`))
})