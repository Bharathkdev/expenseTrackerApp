/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet
} from 'react-native';

import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ExpenseNavigator from './Navigator/ExpenseBottomNavigator';
import AddDataReducer from './Store/Reducers/AddDataReducer';
import ReduxThunk from 'redux-thunk';

const rootReducer = combineReducers({
  data: AddDataReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <ExpenseNavigator />
    </Provider>
  );
};

const styles = StyleSheet.create({

});

export default App;
