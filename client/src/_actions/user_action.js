import axios from 'axios';
import {
    LOGIN_USER
} from './types'
// dataToSubmit이라고 명명지어준 파라미터를 통해 body 데이터를 받는 것
export function loginUser(dataToSubmit){

    // 이 서버에다가 request를 날리고 (나 이런 login 정보 받았는데 맞냐~)
    const request = axios.post('/api/users/login', dataToSubmit)
        // response 받은거에다가 data. 이런식으로 서버에서 받은 data를 7번째줄 변수로 해준 request에다가 저장 
        .then(response => response.data)

    // return 해서 Reducer로 보내야함
    // ㄴ 왜냐하면 Reducer에서 (previousState과, action을 조합해서) => nextState를 만들어주기에
    return {
        type: LOGIN_USER,
        payload: request 
        // 여기서 payload는 26강 Action의 형태에서 type 오른쪽 부분을 가르키는 명칭으로 사용하는듯
        // 여기서 request는 axios를 통해 받은! data를 말함 (위에 7번째줄에서 변수명을 request라고 했을뿐임)
    }

}