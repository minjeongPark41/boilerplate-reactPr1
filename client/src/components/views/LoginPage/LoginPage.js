import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import {loginUser} from '../../../_actions/user_action'

function LoginPage(props) {
    const dispatch = useDispatch()

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    // setEmail을 이용해서 Email state를 바꿔줄 수 있다.
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        // sumit 버튼 눌러서 페이지 리프레시 되는 것을 막아주기 위해
        event.preventDefault()

        // 현재 state가 어떠한지 위해서 테스트 해준 코드
        // console.log('Email', Email)
        // console.log('Password', Password)

        let body = {
            email: Email,
            password: Password
        }

        // dispatch 이용해서 Action 취하기 (Action 이름이 loginUser, redux 사용할 때는 body를 여기에)
        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess){
                    props.history.push('/')
                }else{
                    alert('로그인 정보를 다시 입력해주세요')
                }
            })

    }


    return (
        <div style={{
            display:'flex', justifyContent:'center', alignItems:'center'
            , width:'100%', height:'100vh'
        }}>

            <form style={{display:'flex', flexDirection:'column'}}
                onSubmit = {onSubmitHandler}
            >

                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} /> 
                <label>Password</label>
                <input type="email" value={Password} onChange={onPasswordHandler} /> 

                <br/>
                <button type="submit">
                    Login
                </button>

                
            </form>
       
        </div>
    )
}

export default LoginPage
