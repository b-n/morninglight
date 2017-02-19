import React from 'react'

import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'remote-redux-devtools'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'

import Scheduler from './containers/scheduler'

import rootReducer from './reducers/root-reducer'
import rootSaga from './sagas/root-saga'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))

if (module.hot) {
  module.hot.accept(() => {
    // eslint-disable-next-line
    const nextRootReducer = require('./reducers/root-reducer').default
    store.replaceReducer(nextRootReducer)
  })
}

sagaMiddleware.run(rootSaga)

const App = () => (
  <Provider store={store}>
    <Scheduler />
  </Provider>
)

export default App
