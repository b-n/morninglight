import React, { Component } from 'react';
import {
  Text
} from 'react-native';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers/root-reducer';
import rootSaga from './sagas/root-saga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

if (module.hot) {
  module.hot.accept(() => {
    const nextRootReducer = require('./reducers/root-reducer').default;
    store.replaceReducer(nextRootReducer);
  });
}

sagaMiddleware.run(rootSaga);


import Scheduler from './containers/scheduler';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Scheduler />
      </Provider>
    );
  }
}
