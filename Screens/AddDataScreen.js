import React, {useState, useEffect} from 'react';
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
import * as AddDataActions from '../Store/Actions/AddDataAction';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddDataScreen = (props) => {
  const dataID = props.navigation.getParam('dataID');
  const date = props.navigation.getParam('date');
  const year = new Date(date).getFullYear().toString();
  const month = new Date(date).getMonth().toString();

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const dispatch = useDispatch();

  let details = {},
    index = null,
    dataFromRedux = {};

  const visibilityData = useSelector((state) => state.data.visibility);
  const dataItemsFromRedux = useSelector((state) => state.data.dataItems);

  if (
    dataItemsFromRedux &&
    dataID != null &&
    date != null &&
    year in dataItemsFromRedux &&
    month in dataItemsFromRedux[year] &&
    date in dataItemsFromRedux[year][month]
  ) {
    dataFromRedux = useSelector(
      (state) => state.data.dataItems[year][month][date],
    );
  }

  console.log('Data From Redux : ', dataFromRedux);

  if (dataFromRedux) {
    const dateIdInRedux = Object.keys(dataFromRedux);

    index = dateIdInRedux[0];
  }

  if (dataID != null && date != null) {
    details = useSelector((state) =>
      state.data.dataItems[year][month][date][index].details.find(
        (data) => data.id == dataID,
      ),
    );
  }

  console.log('visibilty: ', visibilityData);

  console.log('Details already available in add data screen: ', details);

  const [type, setType] = useState(dataID && details ? details.type : 'Income');

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
    props.navigation.setParams({
      title: type,
      dispatch: dispatch,
      visibilityData: visibilityData,
    });
  }, [type, visibilityData, dispatch]);

  // props.navigation.setParams({ dispatch: dispatch });

  console.log('Type of data stored in add data screen: ', type);

  return (
    <View style={{flex: moderateScale(1), backgroundColor: 'white'}}>
      <View style={styles.typeViewStyle}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            ...styles.typeStyle,
            borderColor: type === 'Income' ? '#1E90FF' : 'grey',
          }}
          onPress={() => {
            setType('Income');
          }}>
          <Text
            style={{
              color: type === 'Income' ? '#1E90FF' : 'grey',
              fontFamily: 'OpenSans-Bold',
            }}>
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            ...styles.typeStyle,
            borderColor: type === 'Expense' ? '#DC143C' : 'grey',
          }}
          onPress={() => {
            setType('Expense');
          }}>
          <Text
            style={{
              color: type === 'Expense' ? '#DC143C' : 'grey',
              fontFamily: 'OpenSans-Bold',
            }}>
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            ...styles.typeStyle,
            borderColor: type === 'Transfer' ? 'black' : 'grey',
          }}
          onPress={() => {
            setType('Transfer');
          }}>
          <Text
            style={{
              color: type === 'Transfer' ? 'black' : 'grey',
              fontFamily: 'OpenSans-Bold',
            }}>
            Transfer
          </Text>
        </TouchableOpacity>
      </View>
      <AddDataComponent
        title={type}
        date={date}
        details={details}
        dataID={details ? dataID : null}
        paymentItems={paymentItems}
        categoryItemsIncome={categoryItemsIncome}
        categoryItemsExpense={categoryItemsExpense}
        navigation={props.navigation}
      />
    </View>
    //</ScrollView>
  );
};

AddDataScreen.navigationOptions = (navData) => {
  const title = navData.navigation.getParam('title');
  const dispatch = navData.navigation.getParam('dispatch');
  const visibilityData = navData.navigation.getParam('visibilityData');

  console.log('visibility: ', visibilityData);

  return {
    headerTitle: () => (
      <Text style={{fontSize: moderateScale(17), fontFamily: 'OpenSans-Bold'}}>
        {' '}
        {title}{' '}
      </Text>
    ),
    headerLeft: () => (
      <View style={styles.leftIcon}>
        <Icon
          name="keyboard-backspace"
          size={moderateScale(35)}
          color="grey"
          onPress={() => {
            navData.navigation.goBack();
            dispatch(
              AddDataActions.updateVisibility(
                true,
                visibilityData.editDataVisible,
              ),
            );
          }}
        />
      </View>
    ),
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
    alignItems: 'center',
    marginTop: '15@ms',
    marginHorizontal: '10@ms',
    // backgroundColor: 'white',
  },

  typeStyle: {
    borderWidth: '1@ms',
    borderRadius: '7@ms',
    borderColor: 'grey',
    paddingVertical: '5@ms',
    paddingHorizontal: '29@ms',
  },
});

export default AddDataScreen;
