import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import * as AddDataActions from '../Store/Actions/AddDataAction';

const MonthlyTemplate = (props) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  console.log(
    'Im monthly template: ',
    months.indexOf(props.month),
    monthYearFilterData.year,
  );
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        props.navigation.navigate({
          routeName: 'Calendar',
          params: {
            month: months.indexOf(props.month),
            year: monthYearFilterData.year,
          },
        });
      }}>
      <View style={styles.monthContainer}>
        <View
          style={{
            ...styles.monthBox,
            borderColor:
              props.dataDetails.year == new Date().getFullYear() &&
              props.dataDetails.month == new Date().getMonth()
                ? '#DC143C'
                : 'grey',
          }}>
          <Text
            style={{
              ...styles.monthText,
              color:
                props.dataDetails.year == new Date().getFullYear() &&
                props.dataDetails.month == new Date().getMonth()
                  ? '#DC143C'
                  : 'black',
            }}>
            {props.month}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end', paddingLeft: 10}}>
          <Text adjustsFontSizeToFit numberOfLines={1} style={{color: 'green'}}>
            {'\u20A8'}{' '}
            {props.dataDetails.income
              .toFixed(2)
              .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            paddingLeft: 10,
            paddingRight: 20,
          }}>
          <Text adjustsFontSizeToFit numberOfLines={1} style={{color: 'red'}}>
            {'\u20A8'}{' '}
            {props.dataDetails.expense
              .toFixed(2)
              .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: 'lightgrey',
          borderBottomWidth: 1,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  monthContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  monthText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold',
  },

  monthBox: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    width: '15%',
    borderWidth: 2,
    borderColor: 'grey',
    borderStyle: 'solid',
  },
});

export default MonthlyTemplate;
