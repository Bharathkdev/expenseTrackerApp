import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, Button} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import CommonAmountHeader from '../Components/CommonAmountHeader';
import WeeklyTemplate from '../Components/WeeklyTemplate';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import Colors from '../Constants/Colors';
import BouncingLoader from '../Components/BouncingLoader';
import {withNavigationFocus, withNavigation} from 'react-navigation';

const WeeklyScreen = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  console.log('I am Screen Weekly');

  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  const dispatch = useDispatch();

  const getDaysInAMonth = (
    year = +Moment().format('YYYY'),
    month = +Moment().format('MM') - 1,
  ) => {
    const moment = extendMoment(Moment);
    const startDate = moment([year, month]);

    const firstDay = moment(startDate).startOf('month');

    const endDay = moment(startDate).endOf('month');

    const monthRange = moment.range(firstDay, endDay);

    const weeks = [];
    const days = Array.from(monthRange.by('day'));

    days.forEach((it) => {
      if (!weeks.includes(it.week())) {
        weeks.push(it.week());
      }
    });

    const calendar = [];
    weeks.forEach((week) => {
      const firstWeekDay = moment([year, month]).week(week).day(0);
      const lastWeekDay = moment([year, month]).week(week).day(6);
      const weekRange = moment.range(firstWeekDay, lastWeekDay);
      calendar.push(Array.from(weekRange.by('day')));
    });

    console.log('Moment calendar: ', calendar);
    return calendar;
  };

  const loadWeeklyData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(AddDataActions.fetchData());
      dispatch(
        AddDataActions.loadTransactionsWeekly(
          getDaysInAMonth(monthYearFilterData.year, monthYearFilterData.month),
          monthYearFilterData.year,
        ),
      );
    } catch (error) {
      setError(error.message);
      console.log('Error in weekly screen: ', error);
    }
    setIsLoading(false);
  }, [dispatch, monthYearFilterData]);

  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'didFocus',
      loadWeeklyData,
    );

    return () => {
      willFocusSubscription.remove();
    };
  }, [props.navigation]);

  useEffect(() => {
    loadWeeklyData();
  }, [monthYearFilterData]);

  const dataItems = useSelector((state) => {
    const transformedDataItems = [];

    for (const key in state.data.weeklyFilteredDataItems) {
      transformedDataItems.push({
        week: key,
        dataDetails: state.data.weeklyFilteredDataItems[key],
      });
    }
    return transformedDataItems.reverse();
  });

  console.log('Transformed items in weekly screen: ', dataItems);

  const totalIncomeMonthly = useSelector(
    (state) => state.data.totalIncomeWeekly,
  );
  const totalExpenseMonthly = useSelector(
    (state) => state.data.totalExpenseWeekly,
  );
  const balanceAmountMonthly = useSelector(
    (state) => state.data.balanceAmountWeekly,
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
          onPress={loadWeeklyData}
        />
      </View>
    );
  }

  if (isLoading) {
    return <BouncingLoader />;
  }

  return (
    <View style={styles.container}>
      <CommonAmountHeader
        totalIncomeAllDate={totalIncomeMonthly}
        totalExpenseAllDate={totalExpenseMonthly}
        balanceAmountAllDate={balanceAmountMonthly}
      />
      <FlatList
        keyExtractor={(item) => item.week}
        data={dataItems}
        renderItem={(itemData) => {
          console.log('Item data in monthly screen:', itemData.item);
          return (
            <WeeklyTemplate
              key={new Date().getTime()}
              dataDetails={itemData.item.dataDetails}
              navigation={props.navigation}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },

  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withNavigation(WeeklyScreen);
