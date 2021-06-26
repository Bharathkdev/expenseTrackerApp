import React, {useState, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MonthPicker from 'react-native-month-year-picker';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import {useSelector, useDispatch} from 'react-redux';

const MonthYearPicker = (props) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());

  const showPicker = useCallback((value) => {
    setShow(value);
  }, []);

  const dispatch = useDispatch();

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      console.log('Event picker :', event, newDate);
      showPicker(false);
      setDate(selectedDate);
      dispatch(
        AddDataActions.updateMonthYearFilter(
          selectedDate.getMonth(),
          selectedDate.getFullYear(),
        ),
      );
    },
    [date, showPicker],
  );

  return (
    <View style={styles.leftIcon}>
      <Icon
        name="today"
        size={35}
        color="grey"
        onPress={() => showPicker(true)}
      />
      {show ? (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          //  minimumDate={new Date()}
          //  maximumDate={new Date(2025, 5)}
          locale="en"
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  leftIcon: {
    marginLeft: 20,
  },
});

export default MonthYearPicker;
