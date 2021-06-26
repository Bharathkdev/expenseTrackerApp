import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import DataDetails from './DataDetails';
import * as AddDataActions from '../Store/Actions/AddDataAction';

const DailyTemplate = (props) => {
  console.log('Im the daily template');
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const dispatch = useDispatch();

  const visibilityData = useSelector((state) => state.data.visibility);
  const selectedDataItems = useSelector(
    (state) => state.data.selectedDataItems,
  );

  const onPressHandler = () => {
    if (selectedDataItems.length === 0) {
      dispatch(
        AddDataActions.updateVisibility(false, visibilityData.editDataVisible),
      );
      props.navigation.navigate({
        routeName: 'AddData',
        params: {
          dataID: null,
          date: props.date.toDateString(),
        },
      });
    }
  };

  console.log(
    'Daily template amounts: ',
    props.dataDetails,
    props.totalIncome,
    props.totalExpense,
  );

  if (props.error) {
    return (
      <View style={styles.centerLoader}>
        <Text style={{color: 'grey'}}>An error occured!!</Text>
        <Button
          title="Try Again"
          color={Colors.primaryColor}
          onPress={loadData}
        />
      </View>
    );
  }

  if (props.isLoading) {
    return (
      <View style={styles.centerLoader}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  console.log('Is calendar view: ', props.isCalendarView);

  return (
    <View style={{paddingHorizontal: props.isCalendarView ? 10 : 0, flex: 1}}>
      <TouchableOpacity
        onPress={onPressHandler}
        style={styles.expensesContainer}>
        <View style={styles.dateContainer}>
          {props.date.getDate() < 10 ? (
            <Text
              style={{
                color: 'black',
                fontSize: props.isCalendarView ? 25 : 30,
                fontFamily: 'OpenSans-Bold',
              }}>
              0{props.date.getDate()}
            </Text>
          ) : (
            <Text
              style={{
                color: 'black',
                fontSize: props.isCalendarView ? 25 : 30,
                fontFamily: 'OpenSans-Bold',
              }}>
              {props.date.getDate()}
            </Text>
          )}
          <View style={{paddingLeft: 10}}>
            <View style={styles.dateStyle}>
              <Text
                style={{
                  color: 'black',
                  fontSize: props.isCalendarView ? 10 : 12,
                }}>
                {props.date.getFullYear()}.
              </Text>
              {props.date.getMonth() + 1 < 10 ? (
                <Text
                  style={{
                    color: 'black',
                    fontSize: props.isCalendarView ? 10 : 12,
                  }}>
                  0
                </Text>
              ) : (
                <Text></Text>
              )}
              <Text
                style={{
                  color: 'black',
                  fontSize: props.isCalendarView ? 10 : 12,
                }}>
                {props.date.getMonth() + 1}
              </Text>
            </View>
            <View style={styles.dayView}>
              <Text
                style={{
                  ...styles.dayStyle,
                  fontSize: props.isCalendarView ? 10 : 12,
                }}>
                {days[props.date.getDay()]}
              </Text>
            </View>
          </View>
        </View>
        {Object.keys(props.dataDetails).length != 0 ? (
          <View style={{flex: 1, paddingLeft: 10}}>
            <Text numberOfLines={1} style={{color: 'green'}}>
              {'\u20A8'} {props.totalIncome.toFixed(2)}
            </Text>
          </View>
        ) : null}
        {Object.keys(props.dataDetails).length != 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              paddingLeft: 10,
              paddingRight: 20,
            }}>
            <Text numberOfLines={1} style={{color: 'red'}}>
              {'\u20A8'} {props.totalExpense.toFixed(2)}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
      <View
        style={{
          borderBottomColor: props.isCalendarView ? '#F0F0F0' : 'lightgrey',
          borderBottomWidth: 1,
        }}
      />

      {props.isCalendarView ? (
        Object.keys(props.dataDetails).length != 0 ? (
          <ScrollView>
            {props.dataDetails.map((data) => (
              <DataDetails
                key={data.id}
                dataDetails={data}
                isCalendarView={props.isCalendarView}
                navigation={props.navigation}
              />
            ))}
          </ScrollView>
        ) : (
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Text style={{color: 'lightgrey'}}>No data available</Text>
          </View>
        )
      ) : (
        props.dataDetails.map((data) => (
          <DataDetails
            key={data.id}
            dataDetails={data}
            isCalendarView={props.isCalendarView}
            navigation={props.navigation}
          />
        ))
      )}

      <View
        style={{
          borderBottomColor: props.isCalendarView ? '#F0F0F0' : '#F5F5F5',
          borderBottomWidth: props.isCalendarView
            ? Object.keys(props.dataDetails).length != 0
              ? 1
              : 0
            : 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  expensesContainer: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 15,
  },

  dateStyle: {
    flexDirection: 'row',
  },

  dayView: {
    flex: 1,
  },

  dayStyle: {
    color: 'white',
    fontFamily: 'OpenSans-Bold',
    borderRadius: 5,
    borderColor: 'grey',
    backgroundColor: 'grey',
    textAlign: 'center',
    padding: 2,
  },
});

export default DailyTemplate;
