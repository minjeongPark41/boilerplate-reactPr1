// 제일 먼저 mongoose 가져오기
const mongoose = require('mongoose')

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

// model은 schema를 감싸줌
// 아래와 같이 User라는 model을 만들어주고, 감싸준다. 
const User = mongoose.model('User', userSchema)

// 이 model을 다른 파일에서도 쓸 수 있도록 exports
module.exporrts = {User}