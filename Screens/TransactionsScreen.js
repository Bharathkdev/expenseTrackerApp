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
import * as AddDataActions from '../Store/Actions/AddDataAction';

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

  useEffect(() => {
    console.log('Edit screen: ', visibilityData);
    props.navigation.setParams({visible: visibilityData.addDataVisible});
    // if (visibilityData.editDataVisible) {
    //     props.navigation.navigate('EditData');
    // }
  }, [visibilityData]);

  useEffect(() => {
    if (year) {
      props.navigation.setParams({month: months[month], year: year});
      dispatch(
        AddDataActions.updateVisibility(true, visibilityData.editDataVisible),
      );
    } else {
      props.navigation.setParams({
        month: months[new Date().getMonth()],
        year: new Date().getFullYear(),
      });
      dispatch(
        AddDataActions.updateVisibility(true, visibilityData.editDataVisible),
      );
    }
  }, [month, year, dispatch]);

  return (
    <>
      <TransactionsTopNavigator />
      {visibilityData.addDataVisible ? (
        <View style={styles.addIcon}>
          <Icon
            name="md-add-circle-sharp"
            size={60}
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

  return {
    headerShown: visibility ? true : false,
    headerTitle: () => (
      <Text style={styles.headerTextStyle}>
        {monthHeader} {yearHeader}
      </Text>
    ),
    headerLeft: () => <MonthYearPicker />,
    // headerRight: () => (
    //     <DeleteItemsComponent />
    // )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerTextStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },

  backgroundImageStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },

  addIcon: {
    //  borderWidth: 1,
    // borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 30,
    right: 10,
    height: 70,
    //backgroundColor: 'white',
    borderRadius: 100,
  },
});

export default TransactionsScreen;
