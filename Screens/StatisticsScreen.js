import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MonthYearPicker from '../Components/MonthYearPicker';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import StatisticsIncomeScreen from '../Components/StatisticsTemplate';
import {useSelector} from 'react-redux';
import {CardStyleInterpolators} from 'react-navigation-stack';
import Colors from '../Constants/Colors';
import StatisticsTemplate from '../Components/StatisticsTemplate';
const StatisticsScreen = (props) => {
  const [type, setType] = useState('Income');

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

  const typeHandler = (type) => {
    setType(type);
  };

  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  const year = monthYearFilterData.year;
  const month = monthYearFilterData.month;

  useEffect(() => {
    props.navigation.setParams({month: months[month], year: year});
  }, [monthYearFilterData]);

  const incomeMonthly = useSelector((state) => state.data.totalIncomeMonthly);
  const expenseMonthly = useSelector((state) => state.data.totalExpenseMonthly);

  const dataItems = useSelector((state) => {
    const incomeDataItems = [],
      expenseDataItems = [],
      transformedDataItems = {},
      dataItemsType = {income: {}, expense: {}};

    for (const data in state.data.MonthYearFilteredDataItems) {
      for (const details of state.data.MonthYearFilteredDataItems[data]
        .details) {
        if (details.type == 'Income') {
          dataItemsType.income[details.category] =
            (dataItemsType.income[details.category] || 0) + details.amount;
        } else if (details.type == 'Expense') {
          dataItemsType.expense[details.category] =
            (dataItemsType.income[details.category] || 0) + details.amount;
        }
      }
    }

    for (const key in dataItemsType.income) {
      incomeDataItems.push({
        category: key,
        amount: dataItemsType.income[key],
      });
    }

    for (const key in dataItemsType.expense) {
      expenseDataItems.push({
        category: key,
        amount: dataItemsType.expense[key],
      });
    }

    transformedDataItems['income'] = incomeDataItems.sort(
      (a, b) => a.amount < b.amount,
    );
    transformedDataItems['expense'] = expenseDataItems.sort(
      (a, b) => a.amount < b.amount,
    );
    console.log('Transformed items: ', transformedDataItems);
    return transformedDataItems;
  });

  console.log(
    'Income and expense Monthly: ',
    incomeMonthly,
    expenseMonthly,
    dataItems,
  );

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            borderBottomWidth: type === 'Income' ? 3 : 1,
            borderColor: type === 'Income' ? Colors.primaryColor : 'lightgrey',
            alignItems: 'center',
          }}
          onPress={() => {
            typeHandler('Income');
          }}>
          <Text
            style={{
              ...styles.textStyle,
              color: type === 'Income' ? 'black' : 'grey',
            }}
            numberOfLines={1}>
            Income Rs {incomeMonthly.toFixed(2)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            borderBottomWidth: type === 'Expense' ? 3 : 1,
            alignItems: 'center',
            borderColor: type === 'Expense' ? Colors.primaryColor : 'lightgrey',
          }}
          onPress={() => {
            typeHandler('Expense');
          }}>
          <Text
            style={{
              ...styles.textStyle,
              color: type === 'Expense' ? 'black' : 'grey',
            }}
            numberOfLines={1}>
            Expense Rs {expenseMonthly.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        <StatisticsTemplate
          data={type === 'Income' ? dataItems.income : dataItems.expense}
          total={type === 'Income' ? incomeMonthly : expenseMonthly}
        />
      </View>
    </View>
  );
};

StatisticsScreen.navigationOptions = (navData) => {
  const monthHeader = navData.navigation.getParam('month');
  const yearHeader = navData.navigation.getParam('year');
  return {
    headerShown: true,
    headerTitleContainerStyle: {
      left: moderateScale(55),
    },
    headerTitle: () => (
      <Text style={styles.headerTextStyle}>
        {monthHeader} {yearHeader}
      </Text>
    ),
    headerLeft: () => <MonthYearPicker />,
  };
};

const styles = ScaledSheet.create({
  headerTextStyle: {
    fontSize: '18@ms',
    fontFamily: 'OpenSans-Bold',
  },

  textStyle: {
    fontFamily: 'OpenSans-Bold',
    padding: '10@ms',
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default StatisticsScreen;
