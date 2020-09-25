const express=require("express")
const morgan=require("morgan")
const app=express()
const cors=require('cors') 
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body',function(req,res){
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
let persons=
[
    
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]




const info=()=>{
    return (`<div>
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date()}</p>
            </div>`)
}

const getRandomInt=(max)=>Math.floor(Math.random()*Math.floor(max))

const checkName=(name)=>persons.some(person=>person.name===name)


app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/info',(req,res)=>{
    res.send(info())
})

app.get('/api/persons/:id',(req,res)=>{
    const id=Number(req.params.id)
    const person=persons.find(person=>person.id===id)
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const id=Number(req.params.id)
    console.log(id)
    if(persons.some(person=>person.id===id)){
        persons=persons.filter(person=>person.id!==id)
        res.status(200).end()
    }else{
        res.status(400).json({
            error:'not exist such an id'
        })
    }
})

app.post('/api/persons',(req,res)=>{
    if(!req.body.name || !req.body.number){
        res.status(400).json({
            error:"missing name or number"
        })
    }
    if(checkName(req.body.name)){
        res.status(400).json({
            error:'name must be unique'
        })
    }else{
        const newPerson={
            name:req.body.name,
            number:req.body.number,
            id:getRandomInt(1000000)
        }
        persons=persons.concat(newPerson)
        res.json(newPerson)
    }
})


const PORT=3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
