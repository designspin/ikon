import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

export const injectReducers = (store, name, asyncReducer) => {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(rootReducer(store.asyncReducers));
  store.dispatch({ type: 'RESET'})
};

export default (() => {
  const store = createStore(
    rootReducer(),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
  );

  store.asyncReducers = {}
  return store;
})();