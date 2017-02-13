import { handleActions } from 'redux-actions';
import { v4 as uuidV4 } from 'uuid';

const initialState = {
  schedules: {
    [ uuidV4() ] : {
      enabled: false,
      title: 'Testing 1',
      time: '07:30',
      dow: 'M T W T F S S'
    },
    [ uuidV4() ] : {
      enabled: true,
      title: 'Testing 1',
      time: '07:30',
      dow: 'M T W T F S S'
    },
    [ uuidV4() ] : {
      enabled: false,
      title: 'Testing 1',
      time: '07:30',
      dow: 'M T W T F S S'
    },
    [ uuidV4() ] : {
      enabled: true,
      title: 'Testing 1',
      time: '07:30',
      dow: 'M T W T F S S'
    }
  }
};

const scheduleReducer = handleActions({
  TOGGLE_SCHEDULE: (state, action) => ({
    ...state,
    schedules: {
      ...state.schedules,
      [ action.payload.uuid ] : {
        ...state.schedules[ action.payload.uuid ],
        enabled: !state.schedules[ action.payload.uuid ].enabled
      }
    }
  })
}, initialState);

export default scheduleReducer;
