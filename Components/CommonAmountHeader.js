import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CommonAmountHeader = (props) => {
  console.log(
    'Common header comp: ',
    props.totalIncomeAllDate,
    props.totalExpenseAllDate,
    props.balanceAmountAllDate,
  );
  return (
    <>
      <View style={styles.innerTextContainer}>
        <View style={{alignItems: 'center', flex: 1, paddingHorizontal: 10}}>
          <Text>Income</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={{color: 'green'}}>
            {props.totalIncomeAllDate
              .toFixed(2)
              .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
          </Text>
        </View>

        <View style={{alignItems: 'center', flex: 1}}>
          <Text>Expense</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={{color: 'red'}}>
            {props.totalExpenseAllDate
              .toFixed(2)
              .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
          </Text>
        </View>

        <View style={{alignItems: 'center', flex: 1, paddingHorizontal: 10}}>
          <Text>Balance</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={{color: 'black'}}>
            {props.balanceAmountAllDate
              .toFixed(2)
              .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
          </Text>
        </View>
      </View>

      <View
        style={{
          borderBottomColor: 'lightgrey',
          borderBottomWidth: 1,
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  innerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
  },
});

export default CommonAmountHeader;
