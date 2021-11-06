import {
    LOGIN_USER
} from '../_actions/types'

// 지금은 type:'LOGIN_USER' 하나지만, 기능이 많아지면 type들이 엄청 많아질 것.
// ㄴ 그 type들에 따라 각각 조치를 취해줄 것이기 때문에 switch 이용
// 현재 state 는 ={} 비어있는 상태
// cf) { ... state} 는 '스프레이트 오퍼레이터'라고 하며, 그냥 똑같이 가지고 온다고 보면 됨. 여기선 그냥 빈 상태겠지~

// eslint-disable-next-line
export default function (state ={}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess:action.payload}
        default:
            return state
    }
}