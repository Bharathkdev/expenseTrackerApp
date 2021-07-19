import React, {useState, useRef, useEffect, useCallback} from 'react';
import {View, Text, FlatList, Button, ImageBackground} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import CommonAmountHeader from '../Components/CommonAmountHeader';
import WeeklyTemplate from '../Components/WeeklyTemplate';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import Colors from '../Constants/Colors';
import BouncingLoader from '../Components/BouncingLoader';
import {withNavigationFocus} from 'react-navigation';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';

const WeeklyScreen = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  console.log('I am Screen Weekly');

  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  const dataFromRedux = useSelector((state) => state.data.dataItems);

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

  const loadDataForWeekly = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(AddDataActions.fetchData());
    } catch (error) {
      setError(error.message);
      console.log('Im Weekly screen error: ', error.message);
    }
    if (mounted.current) {
      setIsLoading(false);
    }
  }, [monthYearFilterData]);

  const loadWeeklyData = useCallback(async () => {
    dispatch(
      AddDataActions.loadTransactionsWeekly(
        getDaysInAMonth(monthYearFilterData.year, monthYearFilterData.month),
        monthYearFilterData.year,
      ),
    );
  }, [dispatch, monthYearFilterData]);

  useEffect(() => {
    if (props.isFocused) {
      console.log('Focused weekly');
      dispatch(AddDataActions.updateMonthEnable('Weekly'));
      loadWeeklyData();
    }
  }, [monthYearFilterData, dataFromRedux, props.isFocused]);

  useEffect(() => {
    if (mounted.current) {
      //ComponentDidMount
      loadDataForWeekly();
    }

    return function cleanup() {
      mounted.current = false;
    };
  }, []);

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
                marginBottom: moderateScale(70),
              }}>
              <Button
                title="Reload"
                color={Colors.primaryColor}
                onPress={loadDataForWeekly}
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
              onPress={loadDataForWeekly}
            />
          </>
        )}
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
          console.log('Item data in weekly screen:', itemData.item);
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

const styles = ScaledSheet.create({
  container: {
    backgroundColor: 'white',
  },

  noNetworkImage: {
    height: '100%',
    width: '100%',
    marginBottom: '100@ms',
  },

  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withNavigationFocus(WeeklyScreen);
