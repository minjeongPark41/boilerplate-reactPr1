// 시작점. 시작은 index.js 파일에서부터

const express = require('express') // express를 설치해줬기 때문에 이렇게 가지고 올 수 있는 것
const app = express() // function을 이용해서 새로운 express app을 만들고
const port = 5000 // 3,4,5000번 해도 됨

const mongoose = require('mongoose') //mongoose 설치해줬기에 또 이렇게 가지고 와주고
mongoose.connect('mongodb+srv://min:1234@boilerplate.59spv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    // useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false // 안써주면 오류날 수도 있어서
}).then(() => console.log("mongdb 연결 성공"))
  .catch(err => console.log(err))

app.get('/', (req, res) => { // '/' 디렉토리에 hello world가 출력되도록 지금 해주는 것
  res.send('Hello World~~00!')
})

app.listen(port, () => { // 위에서 5000번을 port로 주었으니, 500번 port에서 아래를 실행하도록 해줌
  console.log(`Example app listening at http://localhost:${port}`)
})