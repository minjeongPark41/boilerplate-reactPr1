const { User } = require("../models/User")

let auth = (req, res, next) => {

    // 인증 처리 하는 곳
    // 1. client 쿠키에서 token을 가져온다.
    // 이전에 쿠키에서 토큰을 x_auth라는 이름으로 저장해주었으므로, 아래와 같이 하면 토큰을 가지고 오게 되는 것
    let token = req.cookies.x_auth

    // 2. token을 decode한 후 유저를 찾는다.
    // User 모델에 가서 함수 만들어주기
    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        // user가 없으면 client에 이렇게 주겠다는 것 
        if(!user) return res.json({isAuth:false, error:true})

        // user가 있다면 (이렇게 req.token, req.user에 넣어주는 이유는 index.js ('/api/users/auth')에서 사용해주려고)
        req.token = token
        req.user = user
        next()
        // next()를 안하면 middleware에 갇혀버림. 우리는 index.js에서 middleware 다음을 또 진행해야하니 꼭 넣어줘야

    })

    // 3. 유저가 있으면 인증 okay

    // 4. 유저가 없으면 인증 no

}

module.exports = {auth}