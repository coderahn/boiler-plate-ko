const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ash:1234@boilerplate.wgilg.mongodb.net/boilerplate?retryWrites=true&w=majority',{
  useNewUrlParser: true, useUnitfiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!This is Express.js.')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})