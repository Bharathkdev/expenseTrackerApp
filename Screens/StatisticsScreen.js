import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MonthYearPicker from '../Components/MonthYearPicker';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';

const StatisticsScreen = (props) => {
  return (
    <View>
      <Text>This is Statistics Screen!!</Text>
    </View>
  );
};

StatisticsScreen.navigationOptions = (navData) => {
  return {
    headerShown: true,
    headerTitle: () => <Text style={styles.headerTextStyle}>Jun 2021</Text>,
    headerLeft: () => <MonthYearPicker />,
  };
};

const styles = ScaledSheet.create({
  headerTextStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20@ms',
    fontFamily: 'OpenSans-Bold',
  },
});

export default StatisticsScreen;
