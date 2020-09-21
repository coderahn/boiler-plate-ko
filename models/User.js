const mongoose      =   require('mongoose');
const bcrypt        =   require('bcrypt');
const saltRounds    =   10;
const jwt           =   require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        defualt : 0        
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
});

//레지스터 라우터의 save()전에 미리 하는 처리(pre())
//function(next)의 next는 콜백으로 레지스터 라우터의 save()로 넘겨짐
userSchema.pre('save', function(next){
    var user = this;    //tihs는 위의 스키마
    
    //password수정일때만 비크립트 로직
    if(user.isModified('password')){   
        //비밀번호를 암호화 시킨다.        
        //Salt를 이용하여 비밀번호 암호화
        //그러기 위해 salt를 먼저 생성
        //saltRounds : salt가 몇글자인지 나타낸 것
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err)
        
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }else{  //이게 없으면 위에서 머뭄
        next()
    }
})

//메소드만들기(비번비교)
userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 1234567 vs 암호화된 비밀번호
    //plainPassword를 암호화한 후, 비교

    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err),
            cb(null, isMatch);        
    })
}

//토큰생성 메소드
userSchema.methods.generateToken = function(cb){
    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기
    //user._id는 mongoose db result의 id
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    //user._id + 'secretToken'    =   token


    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user) 
    })
}

//토큰 복호화 메서드
userSchema.methods.findByToken = function(token, cb){
    var user = this;

    //토큰을 디코드한다
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded, "token" : token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User',userSchema)

module.exports ={User}