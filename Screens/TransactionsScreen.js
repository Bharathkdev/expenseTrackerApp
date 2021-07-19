import React, {useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import MonthYearPicker from '../Components/MonthYearPicker';
import DeleteItemsComponent from '../Components/DeleteItemsComponent';
import customHeaderButton from '../Components/HeaderButton';
import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import TransactionsTopNavigator from '../Navigator/TransactionsTopNavigator';
import {withNavigationFocus} from 'react-navigation';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';

const TransactionsScreen = (props) => {
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );
  const visibilityData = useSelector((state) => state.data.visibility);
  const monthEnable = useSelector((state) => state.data.monthYearPicker);

  const month = monthYearFilterData.month;
  const year = monthYearFilterData.year;
  const Nav = props.navigation.getParam('Nav');
  const dataID = props.navigation.getParam('dataID');
  const date = props.navigation.getParam('date');

  console.log('Im transactions component');

  console.log('data Id and date from transactions screen ', dataID, date, Nav);

  const dispatch = useDispatch();

  console.log('Month year filter: ', monthYearFilterData);

  console.log('Month enabled: ', monthEnable);

  useEffect(() => {
    console.log('Edit screen: ', visibilityData);
    if (props.isFocused) {
      props.navigation.setParams({
        visible: visibilityData.addDataVisible,
        monthEnable: monthEnable.screen,
      });
    }
  }, [visibilityData, monthEnable, props.isFocused]);

  useEffect(() => {
    if (props.isFocused) {
      props.navigation.setParams({month: months[month], year: year});
      dispatch(
        AddDataActions.updateVisibility(true, visibilityData.editDataVisible),
      );
    }
  }, [monthYearFilterData, props.isFocused]);

  // useEffect(() => {
  //   dispatch(
  //     AddDataActions.updateVisibility(true, visibilityData.editDataVisible),
  //   );
  // }, []);

  // useEffect(() => {
  //   if (props.isFocused) {
  //     dispatch(
  //       AddDataActions.updateVisibility(true, visibilityData.editDataVisible),
  //     );
  //   }
  // }, [props.isFocused]);

  return (
    <>
      <TransactionsTopNavigator />
      {visibilityData.addDataVisible ? (
        <View style={styles.addIcon}>
          <Icon
            name="md-add-circle-sharp"
            size={moderateScale(60)}
            color={Colors.primaryColor}
            onPress={() => {
              console.log('Add data screen from add icon');
              props.navigation.navigate({
                routeName: 'AddData',
                params: {
                  dataID: null,
                  date: null,
                },
              });
            }}
          />
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

TransactionsScreen.navigationOptions = (navData) => {
  const monthHeader = navData.navigation.getParam('month');
  const yearHeader = navData.navigation.getParam('year');
  const visibility = navData.navigation.getParam('visible');
  const enableMonth = navData.navigation.getParam('monthEnable');

  return {
    headerShown: visibility ? true : false,
    headerTitleContainerStyle: {
      left: enableMonth === 'Monthly' ? moderateScale(50) : moderateScale(55),
    },
    headerTitle: () => (
      <Text style={styles.headerTextStyle}>
        {enableMonth === 'Monthly' ? null : monthHeader} {yearHeader}
      </Text>
    ),
    headerLeft: () => <MonthYearPicker />,
    // headerRight: () => (
    //     <DeleteItemsComponent />
    // )
  };
};

const styles = ScaledSheet.create({
  container: {
    flex: '1@ms',
  },

  headerTextStyle: {
    fontSize: '18@ms',
    fontFamily: 'OpenSans-Bold',
  },

  addIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70@ms',
    position: 'absolute',
    bottom: '30@ms',
    right: '10@ms',
    height: '70@ms',
  },
});

export default withNavigationFocus(TransactionsScreen);
