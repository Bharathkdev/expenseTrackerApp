import React, {useState, useRef, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Button} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import CommonAmountHeader from '../Components/CommonAmountHeader';
import Colors from '../Constants/Colors';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import BouncingLoader from '../Components/BouncingLoader';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import CalendarGridComponent from '../Components/CalendarGridComponent';
import {withNavigationFocus, withNavigation} from 'react-navigation';

const CalendarScreen = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  const dataFromRedux = useSelector((state) => state.data.dataItems);

  const monthData = props.navigation.getParam('month');
  const yearData = props.navigation.getParam('year');

  const dispatch = useDispatch();
  const mounted = useRef(true);

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

  const loadDataForCalendar = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(AddDataActions.fetchData());
    } catch (error) {
      setError(error.message);
      console.log('Im calendar screen error: ', error.message);
    }
    if (mounted.current) {
      setIsLoading(false);
    }
  }, [monthYearFilterData]);

  const loadCalendarData = useCallback(() => {
    dispatch(
      AddDataActions.loadTransactionsCalendar(
        getDaysInAMonth(monthYearFilterData.year, monthYearFilterData.month),
        monthYearFilterData.year,
        monthYearFilterData.month,
      ),
    );
  }, [monthYearFilterData]);

  useEffect(() => {
    if (props.isFocused) {
      dispatch(AddDataActions.updateMonthEnable('Calendar'));
      loadCalendarData();
      console.log('Focused calendar');
    }
  }, [monthYearFilterData, dataFromRedux, props.isFocused]);

  useEffect(() => {
    if (mounted.current) {
      //ComponentDidMount
      loadDataForCalendar();
    }

    return function cleanup() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (monthData != undefined && yearData != undefined) {
      dispatch(AddDataActions.updateMonthYearFilter(monthData, yearData));
    }
  }, [monthData, yearData]);

  const dataItems = useSelector((state) => {
    const transformedDataItems = [];

    for (const key in state.data.calendarFilteredDataItems) {
      transformedDataItems.push({
        date: new Date(key),
        dataDetails: state.data.calendarFilteredDataItems[key],
      });
    }
    return transformedDataItems;
  });

  console.log('Transformed items in calendar screen: ', dataItems);

  const totalIncomeCalendar = useSelector(
    (state) => state.data.totalIncomeCalendar,
  );
  const totalExpenseCalendar = useSelector(
    (state) => state.data.totalExpenseCalendar,
  );
  const balanceAmountCalendar = useSelector(
    (state) => state.data.balanceAmountCalendar,
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
          onPress={loadDataForCalendar}
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
        totalIncomeAllDate={totalIncomeCalendar}
        totalExpenseAllDate={totalExpenseCalendar}
        balanceAmountAllDate={balanceAmountCalendar}
      />
      <View style={styles.dayHeaderView}>
        <Text style={{...styles.text, color: 'red'}}>Sun</Text>
        <Text style={{...styles.text}}>Mon</Text>
        <Text style={{...styles.text}}>Tue</Text>
        <Text style={{...styles.text}}>Wed</Text>
        <Text style={{...styles.text, marginRight: 5}}>Thu</Text>
        <Text style={{...styles.text, marginRight: 9}}>Fri</Text>
        <Text style={{...styles.text, color: '#145DA0'}}>Sat</Text>
      </View>
      <FlatList
        keyExtractor={(item) => item.date.toDateString()}
        data={dataItems}
        numColumns={7}
        renderItem={(itemData) => {
          return (
            <CalendarGridComponent
              key={new Date().getTime()}
              date={itemData.item.date}
              dataDetails={itemData.item.dataDetails}
              month={monthYearFilterData.month}
              year={monthYearFilterData.year}
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
    flex: 1,
    backgroundColor: 'white',
  },

  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
  },

  dayHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
});

export default withNavigationFocus(CalendarScreen);
