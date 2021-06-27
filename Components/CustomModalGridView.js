import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';

const CustomModalGridView = (props) => {
  const selectItem = (item) => {
    props.selectedItem(item);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={selectItem.bind(this, props.item)}>
      <Text>{props.item}</Text>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 0.5,
    paddingVertical: 20,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
  },
});

export default CustomModalGridView;
