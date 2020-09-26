const mongoose=require('mongoose')
const uniqueValidator=require('mongoose-unique-validator')
const url=process.env.MONGO_URI
console.log('connecting to ', url)
mongoose.set('runValidators', true)
mongoose.connect(url,{ useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true })
    .then( () => {
        console.log('connected to MONGODB')
    })
    .catch((error) => {
        console.log('failed to connect',error.message)
    })

const personSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
        unique:true
    },
    number:{
        type:String,
        match:[/(\d){8,}/,'at least 8 successive digits'],
        required:true
    }
})
personSchema.plugin(uniqueValidator, { message: 'The name has existed' })

personSchema.set('toJSON',{
    transform:(document,ret) => {
        ret.id=ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports=mongoose.model('Person',personSchema)