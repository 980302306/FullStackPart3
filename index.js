
const express=require('express')
const app=express()
const cors=require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const morgan=require('morgan')
morgan.token('body',function(req){
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

require('dotenv').config()
const Person=require('./models/person')




const info=(len) => {
    return (`<div>
                <p>Phonebook has info for ${len} people</p>
                <p>${new Date()}</p>
            </div>`)
}

// const getRandomInt=(max) => Math.floor(Math.random()*Math.floor(max))



app.get('/api/persons',(req,res,next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

app.get('/info',(req,res,next) => {
    Person.find({})
        .then(persons => {
            res.send(info(persons.length))
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id',(req,res,next) => {
    Person.findById(req.params.id)
        .then(result => {
            if(result){
                res.json(result)
            }else{
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id',(req,res,next) => {
    console.log('id',req.params.id)
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            if(!result){
                res.status(400).send({ error:'not exist such an id' })
            }
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id',(req,res,next) => {
    const newPerson={
        name:req.body.name,
        number:req.body.number,
    }
    Person.findByIdAndUpdate(req.params.id,newPerson,{ new:true })
        .then(result => {
            res.json(result)
        })
        .catch(error => next(error))
})

app.post('/api/persons',(req,res,next) => {
    const newPerson=new Person({
        name:req.body.name,
        number:req.body.number,
    })
    newPerson.save()
        .then(person => {
            console.log(person,' has added into database')
            res.json(person)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler =(error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError'){
        return response.status(400).send({ message: error.message })
    }
    next(error)
}
app.use(errorHandler)

const PORT=process.env.PORT
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
