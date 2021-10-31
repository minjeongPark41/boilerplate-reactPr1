// 시작점. 시작은 index.js 파일에서부터

const express = require('express') // express를 설치해줬기 때문에 이렇게 가지고 올 수 있는 것
const app = express() // function을 이용해서 새로운 express app을 만들고
const port = 5000 // 3,4,5000번 해도 됨
const bodyParser = require('body-parser')

const config = require('./config/key')

const {User} = require("./models/User")

// client에서 입력한걸 서버에서 받을 때 필요한게 body-parser
// application/x-www-form-urlencoded로 된 데이터를 분석해서 가지고 옴
app.use(bodyParser.urlencoded({extended: true}))
// application/json 타입으로 된 걸 분석해서 가지고 옴
app.use(bodyParser.json())

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
app.post('/register', (req, res) => {
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






app.listen(port, () => { // 위에서 5000번을 port로 주었으니, 500번 port에서 아래를 실행하도록 해줌
  console.log(`Example app listening at http://localhost:${port}`)
})