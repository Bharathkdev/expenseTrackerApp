import React, {useState, useCallback} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import MonthPicker from 'react-native-month-year-picker';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import {useSelector, useDispatch} from 'react-redux';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import Colors from '../Constants/Colors';

const MonthYearPicker = (props) => {
  const monthYearFilterData = useSelector(
    (state) => state.data.MonthYearFilter,
  );

  const [show, setShow] = useState(false);
  // const [date, setDate] = useState(
  //   new Date(monthYearFilterData.year, monthYearFilterData.month),
  // );

  console.log(
    'Month year picker: ',
    monthYearFilterData,
    // date,
    new Date(monthYearFilterData.year, monthYearFilterData.month),
  );

  const showPicker = useCallback((value) => {
    setShow(value);
  }, []);

  const dispatch = useDispatch();

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate =
        newDate ||
        new Date(monthYearFilterData.year, monthYearFilterData.month);

      console.log('Event picker :', event, newDate);
      showPicker(false);
      //setDate(selectedDate);
      dispatch(
        AddDataActions.updateMonthYearFilter(
          selectedDate.getMonth(),
          selectedDate.getFullYear(),
        ),
      );
    },
    [showPicker, monthYearFilterData],
  );

  return (
    <View style={styles.leftIcon}>
      <Icon
        name="calendar"
        size={moderateScale(34)}
        color={Colors.primaryColor}
        onPress={() => showPicker(true)}
      />
      {show ? (
        <MonthPicker
          onChange={onValueChange}
          value={new Date(monthYearFilterData.year, monthYearFilterData.month)}
          mode="short"
          //minimumDate={new Date(1900, 0)}
          // maximumDate={new Date(1)}
          locale="en"
        />
      ) : null}
    </View>
  );
};

const styles = ScaledSheet.create({
  leftIcon: {
    marginLeft: '20@ms',
  },
});

export default MonthYearPicker;
