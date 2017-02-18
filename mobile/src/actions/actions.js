import { createAction } from 'redux-actions';
import actionTypes from './action-types';

export const toggleSchedule = createAction(actionTypes.TOGGLE_SCHEDULE, uuid => ({ uuid }));
export const selectSchedule = createAction(actionTypes.SELECT_SCHEDULE, uuid => ({ uuid }));
