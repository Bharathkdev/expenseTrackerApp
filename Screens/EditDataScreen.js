import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  Alert,
  BackHandler,
  ImageBackground,
} from 'react-native';
import DailyScreen from './DailyScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import Colors from '../Constants/Colors';
import BouncingLoader from '../Components/BouncingLoader';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import DailyTemplate from '../Components/DailyTemplate';

const EditDataScreen = (props) => {
  console.log('Im the edit data screen');

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const selectedDataItemsList = props.navigation.getParam(
    'selectedDataItemsList',
  );

  const dispatch = useDispatch();
  const selectedDataItems = useSelector(
    (state) => state.data.selectedDataItems,
  );
  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  let totalAmount = 0;

  for (let key of selectedDataItems) {
    if (key.type === 'Income') {
      totalAmount += key.amount;
    } else if (key.type === 'Expense') {
      totalAmount -= key.amount;
    }
  }

  console.log('Delete multipledata component: ', selectedDataItems);

  const deleteMutipleData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    console.log('Edit screen loader state: ', isLoading);
    try {
      await dispatch(
        AddDataActions.deleteMultipleData(
          selectedDataItems,
          monthYearFilterData.year,
          monthYearFilterData.month,
        ),
      );

      dispatch(AddDataActions.updateVisibility(true, false));
      dispatch(AddDataActions.clearDataSelection());
    } catch (error) {
      console.log('Im delete mutiple data method error: ', error);
      setError(error.message);
    }
    setIsLoading(false);
    console.log('Edit screen loader state: ', isLoading);
  }, [selectedDataItems.length, monthYearFilterData]);

  useEffect(() => {
    props.navigation.setParams({dispatch: dispatch});
  }, [dispatch]);

  useEffect(() => {
    if (selectedDataItems.length == 0) {
      props.navigation.goBack();
      dispatch(AddDataActions.updateVisibility(true, false));
    }
  }, [selectedDataItems.length]);

  useEffect(() => {
    props.navigation.setParams({deleteData: deleteMutipleData});
  }, [deleteMutipleData]);

  const handleBackButtonClick = () => {
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
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
                marginBottom: moderateScale(70),
              }}></View>
          </ImageBackground>
        ) : (
          <Text style={{marginBottom: moderateScale(10)}}>
            Something went wrong!!
          </Text>
        )}
      </View>
    );
  }

  return (
    <>
      <View style={styles.textViewStyle}>
        <Text style={styles.textStyle}>
          {selectedDataItems.length}(s) selected
        </Text>
        <Text
          style={{}}
          adjustsFontSizeToFit
          numberOfLines={1}
          style={styles.textStyle}>
          Rs.{' '}
          {totalAmount
            .toFixed(2)
            .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
        </Text>
      </View>
      {isLoading ? <BouncingLoader /> : <DailyScreen />}
    </>
  );
};

EditDataScreen.navigationOptions = (navData) => {
  const dispatch = navData.navigation.getParam('dispatch');
  const callDeleteMultipleData = navData.navigation.getParam('deleteData');

  return {
    headerTitle: () => (
      <Text style={{fontSize: moderateScale(18), fontFamily: 'OpenSans-Bold'}}>
        Edit
      </Text>
    ),
    // headerTintColor: 'white',  deleteBalanceAmountAllDateUpdate = deleteTotalIncomeAllDateUpdate - deleteTotalExpenseAllDateUpdate;

    // console.log("Amounts updated :", balanceAmountAllDateUpdate, totalIncomeAllDateUpdate, totalExpenseAllDateUpdate);
    // headerStyle: {
    //     backgroundColor: '#42526C'
    // },
    headerLeft: () => (
      <View style={styles.leftIcon}>
        <Icon
          name="keyboard-backspace"
          size={35}
          color="grey"
          onPress={() => {
            navData.navigation.goBack();
            dispatch(AddDataActions.updateVisibility(true, false));
            dispatch(AddDataActions.clearDataSelection());
          }}
        />
      </View>
    ),

    headerRight: () => (
      <View style={styles.rightIcon}>
        <Icon
          name="delete"
          size={30}
          color="red"
          onPress={() => {
            Alert.alert(
              'Delete Items',
              'Are you sure you want to delete the selected items?',
              [
                {text: 'No', style: 'default'},
                {
                  text: 'Yes',
                  style: 'destructive',
                  onPress: callDeleteMultipleData,
                },
              ],
            );
          }}
        />
      </View>
    ),
  };
};

const styles = ScaledSheet.create({
  leftIcon: {
    marginLeft: 20,
  },

  rightIcon: {
    marginRight: 20,
  },

  textViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 17,
    backgroundColor: '#040720',
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

  textStyle: {
    color: 'white',
  },
});

export default EditDataScreen;
