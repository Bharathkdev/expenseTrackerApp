import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';

const WeeklyTemplate = (props) => {
  let currentWeek = null;

  currentWeek = props.dataDetails.weekDates.some(
    (date) => date._d.toDateString() === new Date().toDateString(),
  );

  console.log('Weekly weeks: ', props.dataDetails.weekDates, currentWeek);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        props.navigation.navigate('Daily');
      }}>
      <View style={styles.monthContainer}>
        <View
          style={{
            ...styles.monthBox,
            borderColor: currentWeek ? 'tomato' : 'grey',
          }}>
          <View style={{flexDirection: 'row'}}>
            {props.dataDetails.startDate.getDate() < 10 ? (
              <Text
                style={{
                  color: currentWeek ? 'tomato' : 'black',
                  fontFamily: 'OpenSans-Bold',
                }}>
                0
              </Text>
            ) : (
              <Text></Text>
            )}
            <Text
              style={{
                color: currentWeek ? 'tomato' : 'black',
                fontFamily: 'OpenSans-Bold',
              }}>
              {props.dataDetails.startDate.getDate()}.
            </Text>
            {props.dataDetails.startDate.getMonth() + 1 < 10 ? (
              <Text
                style={{
                  color: currentWeek ? 'tomato' : 'black',
                  fontFamily: 'OpenSans-Bold',
                }}>
                0
              </Text>
            ) : (
              <Text></Text>
            )}
            <Text
              style={{
                color: currentWeek ? 'tomato' : 'black',
                fontFamily: 'OpenSans-Bold',
              }}>
              {props.dataDetails.startDate.getMonth() + 1}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            {props.dataDetails.endDate.getDate() < 10 ? (
              <Text
                style={{
                  color: currentWeek ? 'tomato' : 'black',
                  fontFamily: 'OpenSans-Bold',
                }}>
                {' '}
                ~ 0
              </Text>
            ) : (
              <Text
                style={{
                  color: currentWeek ? 'tomato' : 'black',
                  fontFamily: 'OpenSans-Bold',
                }}>
                {' '}
                ~{' '}
              </Text>
            )}
            <Text
              style={{
                color: currentWeek ? 'tomato' : 'black',
                fontFamily: 'OpenSans-Bold',
              }}>
              {props.dataDetails.endDate.getDate()}.
            </Text>
            {props.dataDetails.endDate.getMonth() + 1 < 10 ? (
              <Text
                style={{
                  color: currentWeek ? 'tomato' : 'black',
                  fontFamily: 'OpenSans-Bold',
                }}>
                0
              </Text>
            ) : (
              <Text></Text>
            )}
            <Text
              style={{
                color: currentWeek ? 'tomato' : 'black',
                fontFamily: 'OpenSans-Bold',
              }}>
              {props.dataDetails.endDate.getMonth() + 1}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            paddingLeft: moderateScale(10),
          }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              color: 'green',
            }}>
            {'\u20A8'}{' '}
            {props.dataDetails.income
              .toFixed(2)
              .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            paddingLeft: moderateScale(10),
            paddingRight: moderateScale(20),
          }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              color: 'red',
            }}>
            {'\u20A8'}{' '}
            {props.dataDetails.expense
              .toFixed(2)
              .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: 'lightgrey',
          borderBottomWidth: moderateScale(1),
        }}
      />
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  monthContainer: {
    flexDirection: 'row',
    marginVertical: '10@ms',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  monthBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10@ms',
    padding: '5@ms',
    borderRadius: '5@ms',
    width: '110@ms',
    borderWidth: '2@ms',
    borderColor: 'grey',
    borderStyle: 'solid',
  },
});

export default WeeklyTemplate;
