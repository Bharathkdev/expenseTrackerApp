/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';

import {combineReducers, createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ExpenseNavigator from './Navigator/ExpenseBottomNavigator';
import AddDataReducer from './Store/Reducers/AddDataReducer';
import ReduxThunk from 'redux-thunk';
import SplashScreen from 'react-native-lottie-splash-screen';

const rootReducer = combineReducers({
  data: AddDataReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App: () => React$Node = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <ExpenseNavigator />
    </Provider>
  );
};

export default App;
