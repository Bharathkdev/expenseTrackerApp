import React, {useState, useCallback, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';

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

  let chooseType = [
    {
      label: 'Income',
      value: 'Income',
    },
    {
      label: 'Expense',
      value: 'Expense',
    },
    {
      label: 'Transfer',
      value: 'Transfer',
    },
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
    <ScrollView style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.typeView}>
        <Text
          style={{
            paddingTop: 20,
            fontFamily: 'OpenSans-Bold',
            fontSize: 17,
            color: 'black',
          }}>
          Type:
        </Text>
        <Dropdown
          useNativeDriver={true}
          containerStyle={{width: '50%', paddingLeft: 20}}
          style={{color: 'black'}}
          data={chooseType}
          value={type}
          itemColor={'skyblue'}
          onChangeText={(value) => setType(value)}
        />
      </View>
      <AddDataComponent
        title={type}
        date={date}
        details={details}
        dataID={details ? dataID : null}
        navigation={props.navigation}
      />
    </ScrollView>
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

const styles = StyleSheet.create({
  typeView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftIcon: {
    marginLeft: 20,
  },
});

export default AddDataScreen;
