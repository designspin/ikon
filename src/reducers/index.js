import { combineReducers } from 'redux';
import sessionReducer from './session';
import noticeReducer from './notice';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  noticeState: noticeReducer
});

export default rootReducer;
