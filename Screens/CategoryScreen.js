import React, {useState, useRef, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Dimensions} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import CommonAmountHeader from '../Components/CommonAmountHeader';
import Colors from '../Constants/Colors';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import BouncingLoader from '../Components/BouncingLoader';
import {withNavigationFocus, withNavigation} from 'react-navigation';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import DailyTemplate from '../Components/DailyTemplate';
import LineChart from '../Components/LineChart';

const CategoryScreen = (props) => {
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

  const windowWidth = Dimensions.get('window').width;

  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  const month = monthYearFilterData.month;
  const year = monthYearFilterData.year;

  const dispatch = useDispatch();

  const title = props.navigation.getParam('category');
  const dataFromRedux = useSelector((state) => state.data.dataItems);

  let monthlyTotalAmount = 0,
    yearlyTotalAmount = 0;

  const loadCategoryData = useCallback(() => {
    dispatch(AddDataActions.loadTransactionsPerMonth(month, year));
    dispatch(AddDataActions.loadTransactionsPerYear(year));
  }, [monthYearFilterData]);

  useEffect(() => {
    if (props.isFocused) {
      loadCategoryData();
    }
  }, [props.isFocused, dataFromRedux, monthYearFilterData]);

  const dataItems = useSelector((state) => {
    const transformedDataItems = [];

    for (const data in state.data.MonthYearFilteredDataItems) {
      const categoryDetails = [],
        totalIncome = 0,
        totalExpense = 0;
      for (const details of state.data.MonthYearFilteredDataItems[data]
        .details) {
        if (details.category === title) {
          categoryDetails.push(details);
          if (details.type === 'Income') {
            totalIncome += details.amount;
            monthlyTotalAmount += details.amount;
          } else if (details.type === 'Expense') {
            totalExpense += details.amount;
            monthlyTotalAmount += details.amount;
          }
        }
      }
      if (categoryDetails.length != 0) {
        transformedDataItems.push({
          date: new Date(data),
          dataDetails: categoryDetails,
          totalIncome: totalIncome,
          totalExpense: totalExpense,
        });
      }
    }
    return transformedDataItems.sort((a, b) => b.date - a.date);
  });

  const chartData = useSelector((state) => {
    const transformedChartItems = [];

    for (const month in state.data.yearlyFilteredDataItems) {
      let amount = 0;
      for (const date of state.data.yearlyFilteredDataItems[month].details) {
        for (const data of date) {
          if (data.category === title) {
            amount += data.amount;
            yearlyTotalAmount += data.amount;
          }
        }
      }

      transformedChartItems.push({
        month: month,
        total: amount,
      });
    }

    return transformedChartItems;
  });

  console.log('Line chart data: ', chartData);

  useEffect(() => {
    props.navigation.setParams({title: title});
  }, [title]);

  return (
    <View style={styles.container}>
      <View style={styles.totalAmountStyle}>
        <Text style={{color: 'grey'}}>
          {months[month]} {year}
        </Text>
        <Text
          style={{
            marginTop: moderateScale(5),
            fontSize: moderateScale(20),
            fontFamily: 'OpenSans-Regular',
          }}>
          Rs{' '}
          {monthlyTotalAmount
            .toFixed(2)
            .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
        </Text>
      </View>

      <View
        style={{
          borderBottomWidth: moderateScale(1),
          marginTop: moderateScale(10),
          borderColor: 'lightgrey',
        }}
      />

      <View style={styles.chartContainer}>
        <View style={{marginTop: moderateScale(10)}}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'OpenSans-Regular',
              fontSize: moderateScale(15),
            }}>
            Year: {year}
          </Text>
        </View>
        <LineChart
          marginTop={moderateScale(-30)}
          marginLeft={moderateScale(-5)}
          marginBottom={moderateScale(-10)}
          year={monthYearFilterData.year}
          total={yearlyTotalAmount}
          chartData={chartData}
        />
      </View>
      <View
        style={{
          borderBottomWidth: moderateScale(1),
          borderColor: 'lightgrey',
        }}
      />

      {dataItems.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{textAlign: 'center'}}>No data found!</Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <FlatList
            keyExtractor={(item) => item.date.toDateString()}
            data={dataItems}
            renderItem={(itemData) => {
              return (
                <DailyTemplate
                  key={new Date().getTime()}
                  date={itemData.item.date}
                  dataDetails={itemData.item.dataDetails}
                  totalIncome={itemData.item.totalIncome}
                  totalExpense={itemData.item.totalExpense}
                  navigation={props.navigation}
                />
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

CategoryScreen.navigationOptions = (navData) => {
  const title = navData.navigation.getParam('title');

  return {
    headerShown: true,
    headerTitleContainerStyle: {
      left: moderateScale(50),
    },
    headerTitle: () => <Text style={styles.headerTextStyle}>{title}</Text>,
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
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
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

export default withNavigationFocus(CategoryScreen);
