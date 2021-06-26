import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

const WeeklyTemplate = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('Daily');
      }}>
      <View style={styles.monthContainer}>
        <View
          style={{
            ...styles.monthBox,
            borderColor:
              props.dataDetails.year == new Date().getFullYear() &&
              props.dataDetails.month == new Date().getMonth()
                ? '#FFCBA4'
                : 'grey',
          }}>
          <View style={{flexDirection: 'row'}}>
            {props.dataDetails.startDate.getDate() < 10 ? (
              <Text style={{color: 'black', fontFamily: 'OpenSans-Bold'}}>
                0
              </Text>
            ) : (
              <Text></Text>
            )}
            <Text style={{color: 'black', fontFamily: 'OpenSans-Bold'}}>
              {props.dataDetails.startDate.getDate()}.
            </Text>
            {props.dataDetails.startDate.getMonth() + 1 < 10 ? (
              <Text style={{color: 'black', fontFamily: 'OpenSans-Bold'}}>
                0
              </Text>
            ) : (
              <Text></Text>
            )}
            <Text style={{color: 'black', fontFamily: 'OpenSans-Bold'}}>
              {props.dataDetails.startDate.getMonth() + 1}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            {props.dataDetails.endDate.getDate() < 10 ? (
              <Text style={{color: 'black', fontFamily: 'OpenSans-Bold'}}>
                {' '}
                ~ 0
              </Text>
            ) : (
              <Text style={{color: 'black', fontFamily: 'OpenSans-Bold'}}>
                {' '}
                ~{' '}
              </Text>
            )}
            <Text style={{color: 'black', fontFamily: 'OpenSans-Bold'}}>
              {props.dataDetails.endDate.getDate()}.
            </Text>
            {props.dataDetails.endDate.getMonth() + 1 < 10 ? (
              <Text style={{color: 'black', fontFamily: 'OpenSans-Bold'}}>
                0
              </Text>
            ) : (
              <Text></Text>
            )}
            <Text style={{color: 'black', fontFamily: 'OpenSans-Bold'}}>
              {props.dataDetails.endDate.getMonth() + 1}
            </Text>
          </View>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end', paddingLeft: 10}}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{color: 'green', marginTop: 7}}>
            {'\u20A8'} {props.dataDetails.income.toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            paddingLeft: 10,
            paddingRight: 20,
          }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{color: 'red', marginTop: 7}}>
            {'\u20A8'} {props.dataDetails.expense.toFixed(2)}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: 'lightgrey',
          borderBottomWidth: 1,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  monthContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },

  monthText: {
    textAlign: 'center',
  },

  monthBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    width: '27%',
    borderWidth: 2,
    borderColor: 'grey',
    borderStyle: 'solid',
  },
});

export default WeeklyTemplate;
