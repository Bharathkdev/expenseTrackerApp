import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';

const StatisticsList = (props) => {
  console.log('Total in statistics: ', props.color, props.index);
  return (
    <View>
      <TouchableOpacity
        style={styles.listContainer}
        onPress={() => {
          props.navigation.navigate('Category', {
            category: props.dataDetails.category,
            type: props.type,
          });
        }}>
        <View
          style={{
            ...styles.percentageView,
            backgroundColor: props.color[props.index],
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>
            {props.dataDetails.amount === 0
              ? '0'
              : Math.round((props.dataDetails.amount / props.total) * 100)}{' '}
            %
          </Text>
        </View>
        <View style={styles.categoryView}>
          <Text>{props.dataDetails.category}</Text>
        </View>
        <View style={styles.amountView}>
          <Text>Rs. {props.dataDetails.amount.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          borderBottomColor: '#F5F5F5',
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  listContainer: {
    flexDirection: 'row',
    marginVertical: '10@ms',
    marginHorizontal: '15@ms',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  percentageView: {
    fontFamily: 'OpenSans-Bold',
    borderRadius: 5,
    borderColor: 'grey',
    textAlign: 'center',
    width: '12%',
    paddingVertical: '3@ms',
  },

  categoryView: {
    flex: 1,
    left: '20@ms',
  },

  amountView: {
    marginRight: '5@ms',
  },
});

export default StatisticsList;
