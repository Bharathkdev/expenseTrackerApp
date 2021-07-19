import React, {useCallback, useRef, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ImageBackground} from 'react-native';
import MonthYearPicker from '../Components/MonthYearPicker';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import StatisticsIncomeScreen from '../Components/StatisticsTemplate';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../Constants/Colors';
import StatisticsTemplate from '../Components/StatisticsTemplate';
import {withNavigation, withNavigationFocus} from 'react-navigation';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import BouncingLoader from '../Components/BouncingLoader';

const StatisticsScreen = (props) => {
  const [type, setType] = useState('Income');
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

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

  const dataFromRedux = useSelector((state) => state.data.dataItems);

  const dispatch = useDispatch();

  const year = monthYearFilterData.year;
  const month = monthYearFilterData.month;
  const mounted = useRef(true);

  useEffect(() => {
    props.navigation.setParams({month: months[month], year: year});
  }, [monthYearFilterData]);

  const loadDataForStatistics = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      console.log('Month year filters in add ', monthYearFilterData);
      await dispatch(AddDataActions.fetchData());
     
    } catch (error) {
      setError(error.message);
      console.log('Im daily screen error: ', error.message);
    }
    if(mounted.current) {
    setIsLoading(false);
    }
  }, [monthYearFilterData]);

  const loadStatisticsData = useCallback(() => {
    dispatch(
      AddDataActions.loadTransactionsPerMonth(
        monthYearFilterData.month,
        monthYearFilterData.year,
      ),
    );
  }, [monthYearFilterData]);

  useEffect(() => {
    
      if (props.isFocused) {
        loadStatisticsData();
      }
    
  }, [monthYearFilterData, dataFromRedux, props.isFocused]);

  useEffect(() => {
    if (mounted.current) {
      console.log('Im daily mounted'); //ComponentDidMount
      loadDataForStatistics();
    }

    return function cleanup() {
      mounted.current = false;
    };
  }, []);

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
            (dataItemsType.expense[details.category] || 0) + details.amount;
        }
        console.log('Amount added for each category: ', dataItemsType);
      }
      console.log('Data details statistics: ', data, dataItemsType);
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
    console.log('Transformed items in statistics: ', transformedDataItems);
    return transformedDataItems;
  });

  const incomeMonthly = useSelector((state) => state.data.totalIncomeMonthly);
  const expenseMonthly = useSelector((state) => state.data.totalExpenseMonthly);

  console.log(
    'Income and expense Monthly: ',
    incomeMonthly,
    expenseMonthly,
    dataItems,
  );

  if (error) {
    return (
      <View style={styles.centerLoader}>
        <Text style={{color: 'grey'}}>
          {error === 'Network request failed' ? (
            <Text>Check your Internet Connectivity</Text>
          ) : (
            <Text>An error occured!!</Text>
          )}
        </Text>
        <Button
          title="Try Again"
          color={Colors.primaryColor}
          onPress={loadDataForDaily}
        />
      </View>
    );
  }

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

      {isLoading ? (
        <BouncingLoader />
      ) : (
        <View style={{flex: 1}}>
          <StatisticsTemplate
            data={type === 'Income' ? dataItems.income : dataItems.expense}
            total={type === 'Income' ? incomeMonthly : expenseMonthly}
            type={type}
            navigation={props.navigation}
          />
        </View>
      )}
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

  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default withNavigationFocus(StatisticsScreen);
