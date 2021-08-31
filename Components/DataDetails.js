import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';

const DataDetails = (props) => {
  const dispatch = useDispatch();
  const selectedDataItems = useSelector(
    (state) => state.data.selectedDataItems,
  );

  const visibilityData = useSelector((state) => state.data.visibility);

  console.log('selected items length: ', selectedDataItems);

  let amount;

  console.log(
    'Im data details page: ',
    props.dataDetails.id,
    ' ',
    new Date(props.dataDetails.date),
    props.dataDetails.amount,
  );

  const longPressHandler = () => {
    if (selectedDataItems.length === 0) {
      dispatch(
        AddDataActions.updateDataSelection(
          props.dataDetails.id,
          props.dataDetails.date,
          props.dataDetails.amount,
          props.dataDetails.type,
        ),
      );
      dispatch(AddDataActions.updateVisibility(false, true));
      props.navigation.navigate({
        routeName: 'EditData',
        params: {
          selectedDataItemsList: selectedDataItems,
        },
      });
    } else {
      dispatch(
        AddDataActions.updateDataSelection(
          props.dataDetails.id,
          props.dataDetails.date,
          props.dataDetails.amount,
          props.dataDetails.type,
        ),
      );
      props.navigation.navigate({
        routeName: 'EditData',
        params: {
          selectedDataItemsList: selectedDataItems,
        },
      });
    }
  };

  const onPressNavigate = () => {
    props.navigation.navigate({
      routeName: 'AddData',
      params: {
        dataID: props.dataDetails.id,
        date: new Date(props.dataDetails.date).toDateString(),
      },
    });
  };

  const onPressActionCall = () => {
    dispatch(
      AddDataActions.updateVisibility(false, visibilityData.editDataVisible),
    );
  };

  const onPressHandler = () => {
    if (selectedDataItems.length === 0) {
      console.log('onPress handler called inside');
      onPressActionCall();
      onPressNavigate();
    } else {
      console.log('onPress handler called outside');
      dispatch(
        AddDataActions.updateDataSelection(
          props.dataDetails.id,
          props.dataDetails.date,
          props.dataDetails.amount,
          props.dataDetails.type,
        ),
      );
      props.navigation.navigate({
        routeName: 'EditData',
        params: {
          selectedDataItemsList: selectedDataItems,
        },
      });
    }
  };

  if (props.dataDetails.type == 'Income') {
    amount = (
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={{
          flex: 1,
          color: 'green',
          textAlign: 'right',
        }}>
        {'\u20A8'}{' '}
        {props.dataDetails.amount
          .toFixed(2)
          .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
      </Text>
    );
  } else if (props.dataDetails.type == 'Expense') {
    amount = (
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={{flex: 1, color: 'red', textAlign: 'right'}}>
        {'\u20A8'}{' '}
        {props.dataDetails.amount
          .toFixed(2)
          .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
      </Text>
    );
  } else {
    amount = (
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={{flex: 1, color: 'black', textAlign: 'right'}}>
        {'\u20A8'}{' '}
        {props.dataDetails.amount
          .toFixed(2)
          .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
      </Text>
    );
  }

  const selectedDataItemsHandler = (id) => {
    for (let key of selectedDataItems) {
      if (key.id === id) {
        return true;
      }
    }
    return false;
  };

  return (
    <TouchableOpacity
      onPress={onPressHandler}
      onLongPress={props.isCalendarView ? null : longPressHandler}
      delayLongPress={500}
      style={{
        ...styles.detailsView,
        backgroundColor: selectedDataItemsHandler(props.dataDetails.id)
          ? '#FDE5DF'
          : '',
      }}>
      {props.dataDetails.type == 'Transfer' ? (
        <Text
          style={{
            flex: 1,
            color: 'grey',
            fontSize: props.isCalendarView
              ? moderateScale(11)
              : moderateScale(12),
          }}>
          Transfer
        </Text>
      ) : (
        <Text
          style={{
            flex: 1,
            color: 'grey',
            fontSize: props.isCalendarView
              ? moderateScale(11)
              : moderateScale(12),
          }}>
          {props.isCalendarView
            ? props.dataDetails.category.length > 10
              ? props.dataDetails.category.substring(0, 10) + '...'
              : props.dataDetails.category
            : props.dataDetails.category.length > 12
            ? props.dataDetails.category.substring(0, 12) + '...'
            : props.dataDetails.category}
        </Text>
      )}
      {props.dataDetails.note.length != 0 ? (
        <View
          style={{
            flex: 1,
            paddingTop: props.isCalendarView
              ? moderateScale(1.5)
              : moderateScale(0),
          }}>
          <Text
            style={{
              fontSize: props.isCalendarView
                ? moderateScale(11)
                : moderateScale(12),
            }}>
            {props.dataDetails.note.length > 10
              ? props.dataDetails.note.substring(
                  0,
                  props.isCalendarView ? 12 : 15,
                ) + '...'
              : props.dataDetails.note}
          </Text>
          {props.dataDetails.type == 'Transfer' ? (
            <Text
              style={{
                flex: 1,
                color: 'grey',
                fontSize: props.isCalendarView
                  ? moderateScale(9)
                  : moderateScale(12),
              }}>
              {props.dataDetails.payment} to {props.dataDetails.category}
            </Text>
          ) : (
            <Text
              style={{
                flex: 1,
                paddingRight: moderateScale(0),
                color: 'grey',
                fontSize: props.isCalendarView
                  ? moderateScale(11)
                  : moderateScale(12),
              }}>
              {props.dataDetails.payment}
            </Text>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            paddingTop: props.isCalendarView
              ? moderateScale(1.5)
              : moderateScale(0),
          }}>
          {props.dataDetails.type == 'Transfer' ? (
            <Text
              style={{
                flex: 1,
                color: 'grey',
                fontSize: props.isCalendarView
                  ? moderateScale(11)
                  : moderateScale(12),
              }}>
              {props.dataDetails.payment} to {props.dataDetails.category}
            </Text>
          ) : (
            <Text
              style={{
                flex: 1,
                paddingRight: moderateScale(0),
                color: 'grey',
                fontSize: props.isCalendarView
                  ? moderateScale(11)
                  : moderateScale(12),
              }}>
              {props.dataDetails.payment}
            </Text>
          )}
        </View>
      )}
      {amount}
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '12@ms',
    paddingHorizontal: '20@ms',
  },
});

export default DataDetails;
