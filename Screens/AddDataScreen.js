import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Dimensions,
} from 'react-native';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';

import {useSelector, useDispatch} from 'react-redux';
import AddDataComponent from '../Components/AddDataTemplate';

const AddDataScreen = (props) => {
  const dataID = props.navigation.getParam('dataID');
  const date = props.navigation.getParam('date');
  const category = props.navigation.getParam('category');
  const year = new Date(date).getFullYear().toString();
  const month = new Date(date).getMonth().toString();

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const dispatch = useDispatch();
  const mounted = useRef(true);

  let details = {},
    index = null,
    dataFromRedux = {};

  const visibilityData = useSelector((state) => state.data.visibility);
  const dataItemsFromRedux = useSelector((state) => state.data.dataItems);

  if (
    Object.keys(dataItemsFromRedux).length != 0 &&
    dataID != null &&
    date != null &&
    dataItemsFromRedux[year] &&
    dataItemsFromRedux[year][month] &&
    dataItemsFromRedux[year][month][date]
  ) {
    dataFromRedux = dataItemsFromRedux[year][month][date];
  }

  if (Object.keys(dataFromRedux).length != 0) {
    const dateIdInRedux = Object.keys(dataFromRedux);

    index = dateIdInRedux[0];
  }

  if (index) {
    details = dataItemsFromRedux[year][month][date][index].details.find(
      (data) => data.id == dataID,
    );
  }

  const [type, setType] = useState(dataID && details ? details.type : 'Income');

  console.log('Add data screen details: ', details);

  const paymentItems = ['Cash', 'Account', 'Card'];

  const categoryItemsIncome = [
    'Allowance',
    'Salary',
    'Petty cash',
    'Bonus',
    'Other',
  ];

  const categoryItemsExpense = [
    'Social Life',
    'Self-Development',
    'Food',
    'Transportation',
    'Culture',
    'Household',
    'Apparel',
    'Beauty',
    'Health',
    'Education',
    'Gift',
    'Other',
  ];

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

  useEffect(() => {
    return function cleanup() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    props.navigation.setParams({
      title: type,
      dispatch: dispatch,
      visibilityData: visibilityData,
    });
  }, [type, visibilityData, dispatch]);

  return (
    <View style={{flex: moderateScale(1), backgroundColor: 'white'}}>
      <View
        style={{
          ...styles.typeViewStyle,
          marginTop: windowHeight * 0.02,
          marginHorizontal: windowWidth * 0.01,
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            ...styles.typeStyle,
            width: (windowWidth - moderateScale(30)) / 3,
            borderColor: type === 'Income' ? '#1E90FF' : 'grey',
          }}
          onPress={() => {
            setType('Income');
          }}>
          <Text
            style={{
              color: type === 'Income' ? '#1E90FF' : 'grey',
              fontFamily: 'OpenSans-Bold',
              textAlign: 'center',
              fontSize: moderateScale(12),
            }}>
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            ...styles.typeStyle,
            width: (windowWidth - moderateScale(30)) / 3,
            borderColor: type === 'Expense' ? '#DC143C' : 'grey',
          }}
          onPress={() => {
            setType('Expense');
          }}>
          <Text
            style={{
              color: type === 'Expense' ? '#DC143C' : 'grey',
              fontFamily: 'OpenSans-Bold',
              textAlign: 'center',
              fontSize: moderateScale(12),
            }}>
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            ...styles.typeStyle,
            width: (windowWidth - moderateScale(30)) / 3,
            borderColor: type === 'Transfer' ? 'black' : 'grey',
          }}
          onPress={() => {
            setType('Transfer');
          }}>
          <Text
            style={{
              color: type === 'Transfer' ? 'black' : 'grey',
              fontFamily: 'OpenSans-Bold',
              textAlign: 'center',
              fontSize: moderateScale(12),
            }}>
            Transfer
          </Text>
        </TouchableOpacity>
      </View>

      <AddDataComponent
        title={type}
        date={date}
        category={category}
        details={details}
        dataID={Object.keys(details).length != 0 ? dataID : null}
        paymentItems={paymentItems}
        categoryItemsIncome={categoryItemsIncome}
        categoryItemsExpense={categoryItemsExpense}
        navigation={props.navigation}
        mounted={mounted.current}
      />
    </View>
    //</ScrollView>
  );
};

AddDataScreen.navigationOptions = (navData) => {
  const title = navData.navigation.getParam('title');

  return {
    tabBarVisible: false,
    headerTitle: () => (
      <Text style={{fontSize: moderateScale(17), fontFamily: 'OpenSans-Bold'}}>
        {' '}
        {title}{' '}
      </Text>
    ),
    headerLeft: () => null,
  };
};

const styles = ScaledSheet.create({
  typeView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftIcon: {
    marginLeft: '20@ms',
  },

  typeViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    //alignItems: 'center',
    // marginTop: '15@ms',
    // marginHorizontal: '10@ms',
    // backgroundColor: 'white',
  },

  typeStyle: {
    borderWidth: '1@ms',
    borderRadius: '7@ms',
    borderColor: 'grey',
    paddingVertical: '5@ms',
    // paddingHorizontal: '29@ms',
  },
});

export default AddDataScreen;
