import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {ScaledSheet, moderateScale} from 'react-native-size-matters';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Modal from 'react-native-modal';
import DailyTemplate from './DailyTemplate';
import {useSelector, useDispatch} from 'react-redux';
import * as AddDataActions from '../Store/Actions/AddDataAction';

const CalendarGridComponent = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const visibilityData = useSelector((state) => state.data.visibility);

  const displayModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const dispatch = useDispatch();

  console.log(
    'Is modal visible: ',
    props.dataDetails,
    typeof props.dataDetails.details,
  );

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          ...styles.container,
          backgroundColor:
            props.date.getMonth() != props.month
              ? '#F0F0F0'
              : 'white' &&
                props.date.toDateString() === new Date().toDateString()
              ? '#B1D8B7'
              : 'white',
        }}
        onPress={displayModal}>
        <Text
          style={{
            ...styles.dateText,
            color:
              props.date.toDateString() === new Date().toDateString()
                ? 'white'
                : 'black',
          }}>
          {props.date.getDate() === 1 ? (
            <Text>
              {props.date.getDate()}.{props.date.getMonth() + 1}
            </Text>
          ) : (
            props.date.getDate()
          )}
        </Text>
        {props.dataDetails.income != 0 && props.dataDetails.expense === 0 ? (
          <View style={{flex: 1, justifyContent: 'flex-end', paddingLeft: 5}}>
            <Text style={{...styles.innerType, color: 'green'}}>Income</Text>
          </View>
        ) : null}
        {props.dataDetails.expense != 0 && props.dataDetails.income === 0 ? (
          <View style={{flex: 1, justifyContent: 'flex-end', paddingLeft: 5}}>
            <Text style={{...styles.innerType, color: 'red'}}>Expense</Text>
          </View>
        ) : null}
        {props.dataDetails.expense != 0 && props.dataDetails.income != 0 ? (
          <View style={{flex: 1, justifyContent: 'flex-end', paddingLeft: 5}}>
            <Text style={{...styles.innerType, color: 'green'}}>Income</Text>
            <Text style={{...styles.innerType, color: 'red'}}>Expense</Text>
          </View>
        ) : null}
      </TouchableOpacity>
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // onBackdropPress={hideModal}
        onSwipeComplete={hideModal}
        swipeDirection="up"
        backdropTransitionOutTiming={0}
        isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.crossIcon}>
            <Icon name="cancel" size={40} color="white" onPress={hideModal} />
          </View>
          <View style={styles.modalInnerContainer}>
            <DailyTemplate
              date={props.date}
              dataDetails={props.dataDetails.details}
              totalIncome={props.dataDetails.income}
              totalExpense={props.dataDetails.expense}
              isCalendarView={true}
              navigation={props.navigation}
            />

            <View style={styles.addIcon}>
              <Icon
                name="add-circle"
                size={40}
                color="#DC143C"
                onPress={() => {
                  dispatch(
                    AddDataActions.updateVisibility(
                      false,
                      visibilityData.editDataVisible,
                    ),
                  );

                  props.navigation.navigate({
                    routeName: 'AddData',
                    params: {
                      dataID: null,
                      date: props.date.toDateString(),
                    },
                  });
                  hideModal();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 90,
    borderWidth: 0.2,
    borderColor: 'lightgrey',
    borderStyle: 'solid',
  },

  innerType: {
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
  },

  dateText: {
    fontSize: 10,
    paddingLeft: 5,
    fontFamily: 'OpenSans-Bold',
  },

  crossIcon: {
    alignItems: 'center',
  },

  addIcon: {
    alignItems: 'flex-end',
    padding: '10@ms',
  },

  modalContainer: {
    flex: 1,
    padding: '15@ms',
    justifyContent: 'center',
  },

  modalInnerContainer: {
    paddingTop: '10@ms',
    backgroundColor: 'white',
    borderRadius: '10@ms',
    marginVertical: '20@ms',
    minHeight: '300@ms',
  },
});

export default CalendarGridComponent;
