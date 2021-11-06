import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// 리덕스를 <App/>과 연결시켜주기 위해
import { Provider } from 'react-redux' 
// antd 사용
import 'antd/dist/antd.css'; 
// redux 라이브러리에서 2가지 기능을 가지고 와준 것
import { applyMiddleware, createStore } from 'redux'
import promiseMiddleware from 'redux-promise'
import ReduxThunk from 'redux-thunk'
import Reducer from './_reducers'

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)


ReactDOM.render(
  <Provider
    store={createStoreWithMiddleware(Reducer, 
      window.__REDUX_DEVTOOLS_EXTENSION__&& 
      window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >

    <App />
  </Provider>
  
  ,document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
