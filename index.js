const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key.js');

const {User} = require("./models/User");

//application/x-www-form-urlencoded데이터를 분석해서 가져올 수 있도록 해줌
app.use(bodyParser.urlencoded({extended :true}));
//application/json데이터를 분석해서 가져올 수 있도록 해줌
app.use(bodyParser.json());

//쿠키파서 사용(익스프레스 js에서 제공)
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ash:1234@boilerplate.wgilg.mongodb.net/boilerplate?retryWrites=true&w=majority',{
  useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!This is Express.js.!!')
})

//레지스터 라우터 s
app.post('/register', (req,res) => {
  //회원가입할 때 필요한 정보들을 클라이언트에서 가져오면
  //그것들을 데이터 베이스에 넣어준다
  
  //req.body는 바디파서를 이용하여 클라이언트 정보를 넣어줌 to User
  const user = new User(req.body);
  
  //세이브하기전 비밀번호 암호화필요(비크립트)
  user.save((err, userInfo) =>{
    if(err) return res.json({success : false, err})
    return res.status(200).json({
      success : true
    })
  });
})
//레지스터 라우터 e

//로그인 라우터 s
app.post('/login', (req,res) => {
  //로그인시 요청한 이메일을 DB에서 찾아야 함
  User.findOne({email : req.body.email}, (err, user) => {
    if(!user){
      return res.json({loginSuccess : false, message : "제공된 이메일에 해당하는 유저가 없습니다."})
    }
    //요청된 이메일이 DB에 있다면 비밀번호 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({loginSuccess: false, message : "비밀번호가 틀렸습니다."})
      
      //비밀번호 맞다면 Token생성
      user.generateToken((err,user) => {
        if(err) return res.status(400).send(err);
        
        //토큰을 저장한다. 어디에?쿠키,로컬스토리지 등
        //쿠키파서를 깔아야 함
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess : true, userId : user._id})
      })
    })
  })
})
//로그인 라우터 e

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})