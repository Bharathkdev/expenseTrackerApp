import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
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

  const dispatch = useDispatch();

  console.log('Im Add data Screen here');

  console.log(
    'DataID from add data screen: ',
    dataID,
    ' And date here: ',
    date,
    year,
    month,
  );

  let details, index, dataFromRedux;

  const visibilityData = useSelector((state) => state.data.visibility);

  if (date) {
    dataFromRedux = useSelector(
      (state) => state.data.dataItems[year][month][date],
    );
  }

  console.log('DataFromRedux: ', dataFromRedux);

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

  const [type, setType] = useState(dataID && details ? details.type : 'Income');

  console.log('visibilty: ', visibilityData);

  console.log('Details already available in add data screen: ', details);

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
    <View style={{flex: 1, backgroundColor: 'white'}}>
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
      <Text style={{fontSize: 20, fontFamily: 'OpenSans-Bold'}}> {title} </Text>
    ),
    headerLeft: () => (
      <View style={styles.leftIcon}>
        <Icon
          name="keyboard-backspace"
          size={35}
          color="grey"
          onPress={() => {
            navData.navigation.goBack();
            console.log('visibility: ', visibilityData);
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
    marginLeft: 20,
  },

  typeViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 10,
    // backgroundColor: 'white',
  },

  typeStyle: {
    borderWidth: '1@ms',
    borderRadius: '7@ms',
    borderColor: 'grey',
    paddingVertical: '5@ms',
    paddingHorizontal: '30@ms',
  },
});

export default AddDataScreen;
