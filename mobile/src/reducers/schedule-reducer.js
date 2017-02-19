import { handleActions } from 'redux-actions'
import { v4 as uuidV4 } from 'uuid'

const initialState = {
  schedules: [
    {
      uuid: uuidV4(),
      enabled: false,
      title: 'Testing 1',
      time: '07:30',
      dow: 'M T W T F S S',
    },
    {
      uuid: uuidV4(),
      enabled: true,
      title: 'Testing 1',
      time: '07:30',
      dow: 'M T W T F S S',
    },
    {
      uuid: uuidV4(),
      enabled: false,
      title: 'Testing 1',
      time: '07:30',
      dow: 'M T W T F S S',
    },
    {
      uuid: uuidV4(),
      enabled: false,
      title: 'Testing 1',
      time: '07:30',
      dow: 'M T W T F S S',
    },
    {
      uuid: uuidV4(),
      enabled: false,
      title: 'Testing 1',
      time: '07:30',
      dow: 'M T W T F S S',
    },
    {
      uuid: uuidV4(),
      enabled: true,
      title: 'Testing 1',
      time: '07:30',
      dow: 'M T W T F S S',
    },
  ],
}

const scheduleReducer = handleActions({
  SELECT_SCHEDULE: (state, action) => ({
    ...state,
    schedules: state.schedules.map(schedule => ({
      ...schedule,
      expanded: action.payload.uuid === schedule.uuid ? !schedule.expanded : false,
    })),
  }),

  TOGGLE_SCHEDULE: (state, action) => ({
    ...state,
    schedules: state.schedules.map(schedule => ({
      ...schedule,
      enabled: action.payload.uuid === schedule.uuid ? !schedule.enabled : schedule.enabled,
    })),
  }),
}, initialState)

export default scheduleReducer
