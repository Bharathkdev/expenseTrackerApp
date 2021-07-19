import React from 'react';
import {Dimensions, Text, TouchableOpacity} from 'react-native';
import Colors from '../Constants/Colors';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';

const CustomButton = (props) => {
  const windowWidth = Dimensions.get('window').width;
  return (
    <TouchableOpacity
      onPress={props.onSave}
      activeOpacity={0.7}
      style={{...props.style, ...styles.buttonView, width: windowWidth * 0.85}}>
      <Text style={styles.applyTextStyle}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  buttonView: {
    borderRadius: '10@ms',
    padding: '10@ms',
  },

  applyTextStyle: {
    fontSize: '16@ms',
    color: Colors.accentColor,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
  },
});

export default CustomButton;
