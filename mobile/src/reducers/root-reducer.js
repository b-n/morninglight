import { combineReducers } from 'redux'

import scheduleReducer from './schedule-reducer'

const rootReducer = combineReducers(
  {
    scheduleReducer,
  },
)

export default rootReducer
