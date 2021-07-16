import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Button,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import CommonAmountHeader from '../Components/CommonAmountHeader';
import MonthlyTemplate from '../Components/MonthlyTemplate';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import Colors from '../Constants/Colors';
import BouncingLoader from '../Components/BouncingLoader';
import {withNavigationFocus, withNavigation} from 'react-navigation';

const MonthlyScreen = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  console.log('I am Screen Monthly');

  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  const dataFromRedux = useSelector((state) => state.data.dataItems);

  const dispatch = useDispatch();
  const mounted = useRef(true);

  const loadDataForMonthly = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(AddDataActions.fetchData());
    } catch (error) {
      setError(error.message);
      console.log('Im Monthly screen error: ', error.message);
    }
    if (mounted.current) {
      setIsLoading(false);
    }
  }, [monthYearFilterData]);

  const loadYearlyData = useCallback(async () => {
    dispatch(AddDataActions.loadTransactionsPerYear(monthYearFilterData.year));
  }, [monthYearFilterData]);

  useEffect(() => {
    if (props.isFocused) {
      console.log('Focused monthly');
      dispatch(AddDataActions.updateMonthEnable('Monthly'));
      loadYearlyData();
    }
  }, [monthYearFilterData, dataFromRedux, props.isFocused]);

  useEffect(() => {
    if (mounted.current) {
      //ComponentDidMount
      loadDataForMonthly();
    }

    return function cleanup() {
      mounted.current = false;
    };
  }, []);

  const dataItems = useSelector((state) => {
    const transformedDataItems = [];

    for (const key in state.data.yearlyFilteredDataItems) {
      transformedDataItems.push({
        month: key,
        dataDetails: state.data.yearlyFilteredDataItems[key],
      });
    }
    console.log('Transformed items: ', transformedDataItems);
    return transformedDataItems;
  });

  console.log('Yearly transactions: ', dataItems);

  const totalIncomeyearly = useSelector(
    (state) => state.data.totalIncomeYearly,
  );
  const totalExpenseYearly = useSelector(
    (state) => state.data.totalExpenseYearly,
  );
  const balanceAmountYearly = useSelector(
    (state) => state.data.balanceAmountYearly,
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
          onPress={loadDataForMonthly}
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
        totalIncomeAllDate={totalIncomeyearly}
        totalExpenseAllDate={totalExpenseYearly}
        balanceAmountAllDate={balanceAmountYearly}
      />

      {dataItems.length === 0 ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ImageBackground
            style={styles.image}
            resizeMode="contain"
            source={{
              uri:
                'https://image.freepik.com/free-vector/no-data-concept-illustration_114360-2506.jpg',
            }}>
            <Text style={styles.noDataText}>No Data Found!</Text>
          </ImageBackground>
        </View>
      ) : (
        <FlatList
          keyExtractor={(item) => item.month}
          data={dataItems}
          renderItem={(itemData) => {
            console.log('Item data in monthly screen:', itemData.item.month);
            return (
              <MonthlyTemplate
                key={new Date().getTime()}
                month={itemData.item.month}
                dataDetails={itemData.item.dataDetails}
                navigation={props.navigation}
              />
            );
          }}
        />
      )}
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

  image: {
    height: '70%',
    width: '100%',
  },

  noDataText: {
    textAlign: 'center',
    paddingTop: 220,
    color: '#FFD586',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
  },
});

export default withNavigationFocus(MonthlyScreen);
