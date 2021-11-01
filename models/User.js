// 제일 먼저 mongoose 가져오기
const mongoose = require('mongoose')
// 비밀번호 암호화 시키기
const bcrypt = require('bcrypt')
const saltRounds = 10
// 토큰 생성하기
const jwt = require('jsonwebtoken')

// 가지고 온 mongoose를 사용해서 schema 만들기
const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true, // 만약 어떤 사람이 abc @naver.com 으로 적어도 중간에 빈 공백을 없애줌
        unique:1 // 이메일은 중복되는거 없이 unique해야
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlenth:50
    },
    role:{ // role을 주는 이유는 일반 사용자 vs 관리자 등으로 role 이 구분될 수 있기 때문
        type : Number, // 예를 들어 일반 사용자는 0, 관리자는 1로 줄 수 있음
        default :0
    },
    image:String, // 그냥 이렇게로도 줄 수 있다. 
    token:{ // token을 줘서 나중에 유효성 줄 수 있음 (사전 정의 : 문법적으로 더 이상 나눌 수 없는 기본적인 언어요소)
        type:String
    },
    tokenExp:{ // token 유효 기간/시간
        type:Number
    }
})

// Bcrypt로 비밀번호 암호화 하기
// 아래 코드 해석 - save 하기 전에! function을 해준다. 
//  ㄴ 여기서 save는 index.js에서 req.body (데이터를 가지고 와서) / 저장해준다의 그 save 전에 해준다는 것
userSchema.pre('save', function( next ){
    // 아래 코드는 위에 userSchema 내용을 가르키는 것
    var user = this

    // 비밀번호 바꿨을때만! 암호화 해주기 위한 조건 (안그러면 이메일 수정했을 때도 비밀번호 암호화가 되버림)
    if(user.isModified('password')){

        // 해야할 일 - 비밀번호 암호화 시키기. 그래서 위에 const bcrypt = require('bcrypt')

        // bcrypt에서 salt가지고 오는데 (saltRonds 필요해서 가지고오고, )
        bcrypt.genSalt(saltRounds, function(err, salt) {
            // err가 나면 바로 next로 보내주고
        if(err) return next(err) 

            // err가 아니라 제대로 salt를 가지고 왔다면 ~ 
            // (첫번째 인자로는 암호화되지 않은! 비밀번호를 가지고 와야. 그래서 var user = this )
            // 맨 끝의 hash는 암호화된 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash){
                if (err) return next(err)
                // 성공했다면 암호화되지 않은 비밀번호를 (user.password) = hash 암호화된거로 바꿔주기
                user.password = hash
                // 완성되면 돌아가게 해주기
                // 1. 저장하기 전에 function을 실행
                // 2. next를 파라미터로 뭐서, function 실행 후에 next, 즉 index.js에서 save 부분으로 가게 해줌
                next()
            })
        });
    }
    // 비밀번호가 아니라 다른걸 바꿀 때는 next() 주어야 함. 이거 안주면 위에 함수에 같혀있게 됨. (비밀번호 바꿀 때만 next 준 꼴이니)
    else{
        next()
    }
})

// 로그인 기능
userSchema.methods.comparePassword = function(plainPassword, cb){

    // 이 2개가 같은지를 체크해야하는 것
    // plainPassword:123456, 암호화된 비밀번호: $2b$10$TWsGipJFd3.Rk4iI8slhTegM0qGgdm.OegSnQz36..j8pUeZaZVoW
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err),
        // 만약에 에러가 아니라면 (에러는 없고, isMatch - 이 값은 true가 될 것)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){

    var user = this

    // jsonwebtoken 이용해서 token 생성하기
    // 몽고 db 가봐도 _id라고 나옴
    var token = jwt.sign(user._id.toHexString(), 'makingToken')

    // 2개 합쳐서 token 만든거라 다 기억하고 있어야. 
    // 의미는 makingToken 넣어도 user._id를 알 수 있다는 -> 그래서 위에 var token이라고 변수화해서 기억
    
    // user._id + 'makingToken' = token

    // -> 

    // 'makingToken' -> user._id

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        // 만약 save가 잘 딘다면 에러는 없고, user 정보만 잘 전달해주면 됨
        cb(null, user)
        // 여기의 user 정보가 index.js의 user.generateToken(err, user)의 user로 간 것
    })



}




// model은 schema를 감싸줌
// 아래와 같이 User라는 model을 만들어주고, 감싸준다. 
const User = mongoose.model('User', userSchema)

// 이 model을 다른 파일에서도 쓸 수 있도록 exports
module.exports = {User}