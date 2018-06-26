import { combineReducers } from 'redux';
import sessionReducer from './session';
import noticeReducer from './notice';

const rootReducer = asyncReducers => combineReducers({
  sessionState: sessionReducer,
  noticeState: noticeReducer,
  ...asyncReducers
});

export default rootReducer;
