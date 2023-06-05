const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Provide password');
    process.exit(1)
}

const password = process.argv[2]

const url = 'mongodb+srv://beefy1875:@cluster0.h93wm0x.mongodb.net/phonebookApp?retryWrites=true&w=majority'

mongoose.set('strictQuery', false)
mongoose.connect(url)


const phonebookSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', phonebookSchema)


if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
            console.log(person.name, person.number);
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {


    const person = new Person({
        id: Math.floor(Math.random() * 10000),
        name: process.argv[3],
        number: process.argv[4],
    })
    
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close()
    })
}