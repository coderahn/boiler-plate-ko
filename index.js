const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const {User} = require("./models/User");

//application/x-www-form-urlencoded데이터를 분석해서 가져올 수 있도록 해줌
app.use(bodyParser.urlencoded({extended :true}));
//application/json데이터를 분석해서 가져올 수 있도록 해줌
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ash:1234@boilerplate.wgilg.mongodb.net/boilerplate?retryWrites=true&w=majority',{
  useNewUrlParser: true, useUnitfiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!This is Express.js.!!')
})

app.post('/register', (req,res) => {
  //회원가입할 때 필요한 정보들을 클라이언트에서 가져오면
  //그것들을 데이터 베이스에 넣어준다
  
  //req.body는 바디파서를 이용하여 클라이언트 정보를 넣어줌 to User
  const user = new User(req.body);
  
  user.save((err, userInfo) =>{
    if(err) return res.json({success : false, err})
    return res.status(200).json({
      success : true
    })
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})