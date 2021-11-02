// 시작점. 시작은 index.js 파일에서부터

const express = require('express') // express를 설치해줬기 때문에 이렇게 가지고 올 수 있는 것
const app = express() // function을 이용해서 새로운 express app을 만들고
const port = 5000 // 3,4,5000번 해도 됨
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const {auth} = require('./middleware/auth')
const {User} = require("./models/User")



// client에서 입력한걸 서버에서 받을 때 필요한게 body-parser
// application/x-www-form-urlencoded로 된 데이터를 분석해서 가지고 옴
app.use(bodyParser.urlencoded({extended: true}))
// application/json 타입으로 된 걸 분석해서 가지고 옴
app.use(bodyParser.json())
// 이렇게 적어줌으로서 이제 cookieParser 사용할 수 있게 되는거지
app.use(cookieParser())

const mongoose = require('mongoose') //mongoose 설치해줬기에 또 이렇게 가지고 와주고
mongoose.connect(config.mongoURI, {
    // useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false // 안써주면 오류날 수도 있어서
}).then(() => console.log("mongdb 연결 성공"))
  .catch(err => console.log(err))

app.get('/', (req, res) => { // '/' 디렉토리에 hello world가 출력되도록 지금 해주는 것
  res.send('Hello World~~지호지호!')
})

// 위에는 정말 간단한 router. 이제는 회원 가입을 위한 router를 만들어보자
// 이번에 endpoint는 /register로 해보자
// callback fuction을 (req, res) 넣어주고
app.post('/api/users/register', (req, res) => {
    // 회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다. 
    // 이러기 위해서는 저번에 만들어준 model을 가지고 와줘야 함


    // bodyParser가 가지고 온 데이터들은 아래처럼 (req.body해주면 됨)
    // 그리고 이 안에는 id, password 등의 데이터가 담긴 json 데이터들이 담긴 것
    const user = new User(req.body)

    // 위의 데이터가 user 모델에 저장이 된 것
    // callback 함수는 : 만약 에러가 있다면~ { 성공하지 못했다고 json 형식으로 전달해주고, err 메시지도 함께 전달}
    // 근데 만약 성공했다면 json 형식으로 true 전달
    user.save((err, userInfo) =>{
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    })
})

// 로그인 기능 만들기
app.post('/api/users/login', (req, res) => {
  // 1. db에 요청된 이메일이 있는지 찾기
  User.findOne({ email: req.body.email}, (err, user)=>{
    // 만약에 이 이메일(바로 위)을 가진 유저가 한 명도 없다면 user가 없겠지
    if(!user){
      return res.json({
        loginSuccess:false,
        message:"작성한 이메일에 해당되는 유저가 없습니다."
      })
    }
  // 2. 요청된 이메일이 db에 있다면 비밀번호가 맞는 비밀번호인지 확인
    // 메소드를 만들어서 (두가지 argument를 넣어준다. 두번째거는 콜백함수)
    // (err, err가 아니면 isMatch)
    user.comparePassword(req.body.password, (err, isMatch)=>{
      // 메소드는 User모델에서 만들면 됨

      // isMatch가 없다는 것은, 비밀번호가 틀렸다는 것
      if(!isMach) 
        return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})

      // 3. 비밀번호가 맞다면, 토큰 생성하기
      user.generateToken((err, user)=>{
        // client한테 400 상태와 함께, send(err) - 에러메시지도 같이 전달
        if(err) return res.status(400).send(err) 

        // 토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지, 세션 등등 
        // 우리는 우선 쿠키에 저장해보자. 이를 위해서 npm install cookie-parser --save

        // 브라우저에서 x_auth라는 이름으로(그래서 다른 이름도 당근 가능) token이 들어가게 되는 것
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess:true, userId:user_id})
      })
    }) 
  })
})

// 중간의 auth는 middleware
// request 받아서, (콜백함수) 해주기 전에 그 가운데서 실행해주는 것 -> 이를 위해 models 폴더에 middleware 폴더를 만들어주자
app.get('/api/users/auth', auth, (req,res) =>{

  // 여기까지 middleware를 통과해왔다는 얘기는 Authentication이 true라는 말 
  // client에게 전달해주자
  res.status(200).json({
    // req.user._id 등을 해줄 수 있는 이유는 auth.js에서 req.user = user 이런 식으로 넣어줬기 때문
    _id: req.user._id,
    // 지금은 role이 0이면 일반 유저
    isAdmin: req.user.role === 0?false:true,
    isAuth:true,
    email:req.user.email,
    name:req.user.name,
    lastname:req.user.lastname,
    role:req.user.role,
    image:req.user.image

  })

})

// app.get('/api/users/logout', auth, (res, req) => {
// 여기서는 req, res 순서라는 것! 
  app.get('/api/users/logout', auth, (req, res) => {
  // User를 가지고 와서 / 찾아서 업데이트 시킴 / 찾는 건 id로 찾겠지 (middleware에서 가지고 와서 찾는 것)
  // 그리고 token을 지워주는 것
  User.findOneAndUpdate({_id:req.user._id}, {token:""}, (err, user)=>{
      if (err) return res.json({ success:false, err})
      return res.status(200).send({
        success:true
      })
    })
})



app.listen(port, () => { // 위에서 5000번을 port로 주었으니, 500번 port에서 아래를 실행하도록 해줌
  console.log(`Example app listening at http://localhost:${port}`)
})