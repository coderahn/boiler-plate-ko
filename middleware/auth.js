let auth = (req, res, next) => {
    const {User} = require('../models/User');

    //인증처리를 하는 곳

    //클라이언트 쿠키에서 토큰을 가져온다.(쿠키파서 이용)
    let token = req.cookies.x_auth;

    //토큰을 복호화한 후, 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth : false, error : true})
    
        req.token = token;
        req.user  = user;
        next(); //미드웨어에서 계속 갈 수 있도록 next()
    })

    //유저가 있으면 인증 Okay

    //유저가 없으면 인증 No
}

module.exports = {auth};