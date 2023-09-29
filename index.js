require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const unKnownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted ID' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  }

  next(err)
}
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('type', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(returned => {
    res.json(returned)
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(returned => {
    const toReturn = `Phonebook has info for ${returned.length} people</br>${Date()}`
    res.send(toReturn)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(personToReturn => {
    res.send(personToReturn)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .then(person => {
      res.json(person)
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({ ...req.body })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(err => {
      next(err)
    })

})

app.use(unKnownEndpoint)
app.use(errorHandler)

app.listen(3001)