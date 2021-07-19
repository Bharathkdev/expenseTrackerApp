import React, {useState, useRef, useCallback, useEffect} from 'react';
import {View, Text, Button, ImageBackground} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import Colors from '../Constants/Colors';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import BouncingLoader from '../Components/BouncingLoader';
import {withNavigationFocus} from 'react-navigation';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';

import MonthYearPicker from '../Components/MonthYearPicker';
import LineChart from '../Components/LineChart';
import BarChart from '../Components/BarChart';

const AccountsScreen = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  const dataFromRedux = useSelector((state) => state.data.dataItems);

  const dispatch = useDispatch();

  const year = monthYearFilterData.year;
  const mounted = useRef(true);
  let totalAmount = 0,
    totalIncome = 0,
    totalExpense = 0;

  const balanceChartData = useSelector((state) => {
    const balanceChartItems = [];
    const incExpChartItems = [];
    const totalChartData = {};

    for (const month in state.data.yearlyFilteredDataItems) {
      balanceChartItems.push({
        month: month,
        total:
          state.data.yearlyFilteredDataItems[month].income -
          state.data.yearlyFilteredDataItems[month].expense,
      });
      incExpChartItems.push({
        month: month,
        income: state.data.yearlyFilteredDataItems[month].income,
        expense: state.data.yearlyFilteredDataItems[month].expense,
      });
      totalAmount +=
        state.data.yearlyFilteredDataItems[month].income -
        state.data.yearlyFilteredDataItems[month].expense;

      totalIncome += state.data.yearlyFilteredDataItems[month].income;
      totalExpense += state.data.yearlyFilteredDataItems[month].expense;
    }

    totalChartData['balance'] = balanceChartItems;
    totalChartData['incExp'] = incExpChartItems;

    return totalChartData;
  });

  useEffect(() => {
    props.navigation.setParams({year: year});
  }, [monthYearFilterData.year]);

  const loadDataForAccounts = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(AddDataActions.fetchData());
    } catch (error) {
      setError(error.message);
    }
    if (mounted.current) {
      setIsLoading(false);
    }
  }, [monthYearFilterData.year]);

  const loadAccountsData = useCallback(() => {
    dispatch(AddDataActions.loadTransactionsPerYear(monthYearFilterData.year));
  }, [monthYearFilterData.year]);

  useEffect(() => {
    if (props.isFocused) {
      loadAccountsData();
    }
  }, [monthYearFilterData.year, dataFromRedux, props.isFocused]);

  useEffect(() => {
    if (mounted.current) {
      //ComponentDidMount
      loadDataForAccounts();
    }

    return function cleanup() {
      mounted.current = false;
    };
  }, []);

  if (error) {
    return (
      <View style={{...styles.centerLoader, backgroundColor: 'white'}}>
        {error === 'Network request failed' ? (
          <ImageBackground
            style={styles.noNetworkImage}
            resizeMode="contain"
            source={require('../assets/images/noInternet.jpg')}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginBottom: moderateScale(90),
              }}>
              <Button
                title="Reload"
                color={Colors.primaryColor}
                onPress={loadDataForAccounts}
              />
            </View>
          </ImageBackground>
        ) : (
          <>
            <Text style={{marginBottom: moderateScale(10)}}>
              Something went wrong!!
            </Text>
            <Button
              title="Reload"
              color={Colors.primaryColor}
              onPress={loadDataForAccounts}
            />
          </>
        )}
      </View>
    );
  }

  console.log('Bar chart data: ', balanceChartData.incExp);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <BouncingLoader />
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.totalAmountStyle}>
            <Text style={{color: 'grey'}}>Total Balance</Text>
            {totalAmount < 0 ? (
              <Text
                style={{
                  marginTop: moderateScale(5),
                  fontSize: moderateScale(20),
                  fontFamily: 'OpenSans-Regular',
                }}>
                - Rs{' '}
                {Math.abs(totalAmount)
                  .toFixed(2)
                  .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
              </Text>
            ) : (
              <Text
                style={{
                  marginTop: moderateScale(5),
                  fontSize: moderateScale(20),
                  fontFamily: 'OpenSans-Regular',
                }}>
                Rs{' '}
                {Math.abs(totalAmount)
                  .toFixed(2)
                  .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
              </Text>
            )}
          </View>
          <View
            style={{
              borderBottomWidth: moderateScale(1),
              marginTop: moderateScale(10),
              borderColor: 'lightgrey',
            }}
          />

          <View style={{backgroundColor: '#F5F5F5'}}>
            <LineChart
              marginTop={
                totalAmount > 0 ? moderateScale(-20) : moderateScale(-15)
              }
              marginLeft={moderateScale(-5)}
              marginBottom={
                totalAmount > 0 ? moderateScale(-10) : moderateScale(-15)
              }
              year={monthYearFilterData.year}
              total={totalAmount}
              chartData={balanceChartData.balance}
            />
          </View>
          <View
            style={{
              borderBottomWidth: moderateScale(1),
              marginVertical: moderateScale(8),
              borderColor: 'white',
            }}
          />
          <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
            <BarChart
              marginTop={moderateScale(-5)}
              marginLeft={moderateScale(-5)}
              marginBottom={moderateScale(10)}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              chartData={balanceChartData.incExp}
            />
          </View>

          <View
            style={{
              borderBottomWidth: moderateScale(1),
              borderColor: 'lightgrey',
            }}
          />
        </View>
      )}
    </View>
  );
};

AccountsScreen.navigationOptions = (navData) => {
  const yearHeader = navData.navigation.getParam('year');
  return {
    headerShown: true,
    headerTitleContainerStyle: {
      left: moderateScale(55),
    },
    headerTitle: () => <Text style={styles.headerTextStyle}>{yearHeader}</Text>,
    headerLeft: () => <MonthYearPicker />,
  };
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  chartContainer: {
    backgroundColor: '#F5F5F5',
  },

  totalAmountStyle: {
    marginLeft: '20@ms',
    marginTop: '20@ms',
  },

  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: '12@ms',
    fontFamily: 'OpenSans-Regular',
  },

  noNetworkImage: {
    height: '100%',
    width: '100%',
    marginBottom: '100@ms',
  },

  headerTextStyle: {
    fontSize: '17@ms',
    fontFamily: 'OpenSans-Bold',
  },

  dayHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
});

export default withNavigationFocus(AccountsScreen);
