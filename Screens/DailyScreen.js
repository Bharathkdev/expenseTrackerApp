import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../Constants/Colors';

import Popover from 'react-native-popover-view';
import {useSelector, useDispatch} from 'react-redux';
import DailyTemplate from '../Components/DailyTemplate';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import {withNavigation, withNavigationFocus} from 'react-navigation';
import CommonAmountHeader from '../Components/CommonAmountHeader';
import BouncingLoader from '../Components/BouncingLoader';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';

const DailyScreen = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  console.log('I am Screen Daily');

  const dataFromRedux = useSelector((state) => state.data.dataItems);

  const dispatch = useDispatch();

  let touchable;

  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  const visibilityData = useSelector((state) => state.data.visibility);

  console.log('Coming from add data screen ', monthYearFilterData);

  const showPopover = () => {
    setIsVisible(true);
  };

  const closePopover = () => {
    setIsVisible(false);
  };

  const loadDataForDaily = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      console.log('Month year filters in add ', monthYearFilterData);
      await dispatch(AddDataActions.fetchData());
      dispatch(
        AddDataActions.loadTransactionsPerMonth(
          monthYearFilterData.month,
          monthYearFilterData.year,
        ),
      );
    } catch (error) {
      setError(error.message);
      console.log('Im daily screen error: ', error.message);
    }
    setIsLoading(false);
  }, [monthYearFilterData]);

  const loadDailyData = useCallback(() => {
    dispatch(
      AddDataActions.loadTransactionsPerMonth(
        monthYearFilterData.month,
        monthYearFilterData.year,
      ),
    );
  }, [monthYearFilterData]);

  const mounted = useRef();

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true; //ComponentDidMount
      loadDataForDaily();
    } else {
      if (props.isFocused) {
        dispatch(AddDataActions.updateMonthEnable('Daily'));
        loadDailyData(); //ComponentDidUpdate
      }
    }
  }, [monthYearFilterData, dataFromRedux, props.isFocused]);

  const dataItems = useSelector((state) => {
    const transformedDataItems = [];

    for (const key in state.data.MonthYearFilteredDataItems) {
      transformedDataItems.push({
        date: new Date(key),
        dataDetails: state.data.MonthYearFilteredDataItems[key],
      });
    }
    console.log('Transformed items: ', transformedDataItems);
    return transformedDataItems.sort((a, b) => b.date - a.date);
  });

  console.log('Month year filter: ', monthYearFilterData.visible);

  console.log('Daily add data screen here: ', dataItems);

  const totalIncomeAllDate = useSelector(
    (state) => state.data.totalIncomeMonthly,
  );
  const totalExpenseAllDate = useSelector(
    (state) => state.data.totalExpenseMonthly,
  );
  const balanceAmountAllDate = useSelector(
    (state) => state.data.balanceAmountMonthly,
  );

  console.log(
    'TotalIncome Daily add Screen: ',
    totalIncomeAllDate,
    ' ',
    totalExpenseAllDate,
    ' ',
    balanceAmountAllDate,
  );

  useEffect(() => {
    props.navigation.navigate('Transactions');
  }, [visibilityData]);

  console.log('Fiinal array here-------->', dataItems, ' ', dataItems.length);

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
    <View style={styles.container}>
      <CommonAmountHeader
        totalIncomeAllDate={totalIncomeAllDate}
        totalExpenseAllDate={totalExpenseAllDate}
        balanceAmountAllDate={balanceAmountAllDate}
      />

      {isLoading ? (
        <BouncingLoader />
      ) : dataItems.length === 0 ? (
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
          keyExtractor={(item) => item.date.toDateString()}
          data={dataItems}
          renderItem={(itemData) => {
            console.log(
              'Item data in daily screen:',
              itemData.item,
              ' ',
              dataItems.length,
            );
            return (
              <DailyTemplate
                key={new Date().getTime()}
                date={itemData.item.date}
                dataDetails={itemData.item.dataDetails.details}
                totalIncome={itemData.item.dataDetails.totalIncome}
                totalExpense={itemData.item.dataDetails.totalExpense}
                navigation={props.navigation}
              />
            );
          }}
        />
      )}

      <Popover
        isVisible={isVisible}
        from={
          <TouchableOpacity style={styles.infoStyle}>
            <Icon
              ref={(ref) => (touchable = ref)}
              name="info"
              size={moderateScale(30)}
              color={Colors.primaryColor}
              renderToHardwareTextureAndroid={true}
              collapsable={false}
              onPress={showPopover}
            />
          </TouchableOpacity>
        }
        onRequestClose={closePopover}>
        <Text
          style={{
            paddingVertical: moderateScale(5),
            paddingHorizontal: moderateScale(10),
          }}>
          Long press an item(s) to delete
        </Text>
      </Popover>
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  infoStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70@ms',
    position: 'absolute',
    bottom: '85@ms',
    right: '12@ms',
    height: '70@ms',
  },

  image: {
    height: '70%',
    width: '100%',
  },

  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: '15@ms',
  },

  noDataText: {
    textAlign: 'center',
    paddingTop: '220@ms',
    color: '#FFD586',
    fontSize: '20@ms',
    fontFamily: 'OpenSans-Regular',
  },

  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'green',
  },
});

export default withNavigationFocus(DailyScreen);
