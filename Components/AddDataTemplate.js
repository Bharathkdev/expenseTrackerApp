import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
} from 'react-native';
import CustomButton from './CustomButton';
import DateTimePicker from 'react-native-modal-datetime-picker';

import {useSelector, useDispatch} from 'react-redux';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import {Dropdown} from 'react-native-material-dropdown';
import Colors from '../Constants/Colors';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import CustomModalGridView from './CustomModalGridView';

const DATA_INPUT_UPDATE = 'DATA_INPUT_UPDATE';

const dataReducer = (state, action) => {
  console.log('Im the data reducer');
  switch (action.type) {
    case DATA_INPUT_UPDATE:
      const updatedInputs = {
        ...state.inputs,
        [action.input]: action.value,
      };
      console.log('Updated Inputs: ', updatedInputs);

      let updatedInputValidations = {...state.inputValidations};

      if (action.input in state.inputValidations) {
        updatedInputValidations = {
          ...state.inputValidations,
          [action.input]: action.isValid,
        };
      }

      console.log('Updated Input Validations: ', updatedInputValidations);

      let updatedFormValidation = true;

      for (const key in updatedInputValidations) {
        if (!updatedInputValidations[key]) {
          updatedFormValidation = false;
        }
      }

      console.log('Updated FOrm Validation: ', updatedFormValidation);

      return {
        formValidation: updatedFormValidation,
        inputValidations: updatedInputValidations,
        inputs: updatedInputs,
      };
  }
  return state;
};

const AddDataTemplate = (props) => {
  const [transfer, setTransfer] = useState(false);
  const [nav, setNav] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [onFocusAmount, setOnFocusAmount] = useState(false);
  const [onFocusNote, setOnFocusNote] = useState(false);
  const [onFocusDescription, setOnFocusDescription] = useState(false);

  const dataItems = useSelector((state) => state.data.dataItems);
  const visibilityData = useSelector((state) => state.data.visibility);

  const showDatePicker = () => {
    console.log('Show date picker');
    setDatePickerVisibility(true);
  };

  const showTimePicker = () => {
    console.log('Show time picker');
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    console.log('Hide date picker');
    setDatePickerVisibility(false);
  };

  const hideTimePicker = () => {
    console.log('Hide time picker');
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    console.log('Date picked: ', date, typeof date);
    hideDatePicker();
    textChangeHandler('Date', date);
  };

  const handleTimeConfirm = (time) => {
    console.log('Time picked: ', time, typeof time);
    hideTimePicker();
    textChangeHandler('Time', time);
  };

  const displayPaymentModal = () => {
    setIsPaymentModalVisible(true);
  };

  const hidePaymentModal = () => {
    setIsPaymentModalVisible(false);
  };

  const displayCategoryModal = () => {
    setIsCategoryModalVisible(true);
  };

  const hideCategoryodal = () => {
    setIsCategoryModalVisible(false);
  };

  const showFocusAmount = () => {
    setOnFocusAmount(true);
  };

  const hideFocusAmount = () => {
    setOnFocusAmount(false);
  };

  const showFocusNote = () => {
    setOnFocusNote(true);
  };

  const hideFocusNote = () => {
    setOnFocusNote(false);
  };

  const showFocusDescription = () => {
    setOnFocusDescription(true);
  };

  const hideFocusDescription = () => {
    setOnFocusDescription(false);
  };

  const dispatch = useDispatch();

  const dataID = props.dataID;

  // console.log("details in Add data screen::::::", typeof props.details.date, " ", props.details.date, " ", new Date(props.details.date), " ", typeof props.date, " ", props.date, " ", new Date(props.date));

  const mounted = useRef();

  console.log('UseRef: ', mounted.current);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true; //ComponentDidMount
    } else {
      if (props.title === 'Transfer') {
        //ComponentDidUpdate
        setTransfer(true);
      } else {
        setTransfer(false);
      }

      dispatchAddDataState({
        type: DATA_INPUT_UPDATE,
        value: '',
        isValid: false,
        input: 'Category',
      });
    }
  }, [props.title]);

  useEffect(() => {
    console.log('After reducer and after came back add data screen called');
    console.log('Navigation Handler effect and nav ====', nav);
    if (nav) {
      dispatch(
        AddDataActions.updateVisibility(true, visibilityData.editDataVisible),
      );
      props.navigation.goBack();
    }
  }, [nav]);

  const [addDataState, dispatchAddDataState] = useReducer(dataReducer, {
    inputs: {
      Date: dataID
        ? new Date(props.details.date)
        : props.date
        ? new Date(props.date)
        : new Date(),
      Time: dataID ? new Date(props.details.time) : new Date(),
      Payment: dataID ? props.details.payment : '',
      Category: dataID ? props.details.category : '',
      Amount: dataID ? props.details.amount.toFixed(2) : '0.00',
      Note: dataID ? props.details.note : '',
      Description: dataID ? props.details.description : '',
    },
    inputValidations: {
      Date: true,
      Payment: dataID ? true : false,
      Category: dataID ? true : false,
    },
    formValidation: dataID ? true : false,
  });

  console.log('Amount entered_-------->', addDataState.inputs.Amount);
  console.log('Details in Add data template: ', props.details);

  const textChangeHandler = useCallback(
    (identifier, text) => {
      console.log('I am change text handler ', text, identifier);
      if (identifier == 'Amount' && text == '9999999999999999') {
        text = '10000000000000000';
      }
      if (identifier == 'Amount' && text.length != 0) {
        //text = text.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        if (text.split('.')[1]?.length > 2) {
          text = text.substring(
            0,
            text.length - text.split('.')[1]?.length + 2,
          );
        }

        if (isNaN(text) || text.includes(' ')) {
          text = text.substring(0, text.length - 1);
        }

        if (text.length > 15) {
          text = text.substring(0, 16);
        }
      }

      console.log('Im the text ', text);
      dispatchAddDataState({
        type: DATA_INPUT_UPDATE,
        value: text,
        isValid: text.length != 0 ? true : false,
        input: identifier,
      });
    },
    [dispatchAddDataState],
  );

  const saveHandler = async () => {
    if (!addDataState.formValidation) {
      Alert.alert('Alert', 'Please enter the mandatory fields', [
        {text: 'okay'},
      ]);
      setNav(false);
      console.log('nav-------->', nav);
      return;
    }

    const year = addDataState.inputs.Date.getFullYear();
    const month = addDataState.inputs.Date.getMonth();
    const dateInString = addDataState.inputs.Date.toDateString();

    if (
      dataID &&
      new Date(props.details.date).toDateString() ==
        addDataState.inputs.Date.toDateString()
    ) {
      setError(null);
      setIsLoading(true);
      try {
        await dispatch(
          AddDataActions.updateData(
            props.details.id,
            props.title,
            new Date(props.details.date),
            addDataState.inputs.Date,
            addDataState.inputs.Time,
            addDataState.inputs.Payment,
            addDataState.inputs.Category,
            addDataState.inputs.Amount.length == 0
              ? 0.0
              : Math.round(parseFloat(addDataState.inputs.Amount) * 100) / 100,
            addDataState.inputs.Note.trim(),
            addDataState.inputs.Description.trim(),
          ),
        );
        await dispatch(AddDataActions.fetchData());
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
      setNav(true);
      console.log('After reducer add data screen called');
    } else if (dataID == null) {
      setError(null);
      setIsLoading(true);
      try {
        if (
          dataItems &&
          year in dataItems &&
          month in dataItems[year] &&
          dateInString in dataItems[year][month]
        ) {
          await dispatch(
            AddDataActions.addDataInExistingDate(
              props.title,
              addDataState.inputs.Date,
              addDataState.inputs.Time,
              addDataState.inputs.Payment,
              addDataState.inputs.Category,
              addDataState.inputs.Amount.length == 0
                ? 0.0
                : Math.round(parseFloat(addDataState.inputs.Amount) * 100) /
                    100,
              addDataState.inputs.Note.trim(),
              addDataState.inputs.Description.trim(),
            ),
          );
          await dispatch(AddDataActions.fetchData());
        } else {
          await dispatch(
            AddDataActions.addData(
              props.title,
              addDataState.inputs.Date,
              addDataState.inputs.Time,
              addDataState.inputs.Payment,
              addDataState.inputs.Category,
              addDataState.inputs.Amount.length == 0
                ? 0.0
                : Math.round(parseFloat(addDataState.inputs.Amount) * 100) /
                    100,
              addDataState.inputs.Note.trim(),
              addDataState.inputs.Description.trim(),
            ),
          );
        }
        await dispatch(AddDataActions.fetchData());
      } catch (error) {
        setError(error.message);
        console.log('error in add template: ', error.message);
      }
      setIsLoading(false);
      setNav(true);
    } else if (
      dataID &&
      new Date(props.details.date).toDateString() !=
        addDataState.inputs.Date.toDateString()
    ) {
      setError(null);
      setIsLoading(true);
      try {
        console.log('API is called for different dates');
        await dispatch(
          AddDataActions.updateData(
            props.details.id,
            props.title,
            new Date(props.details.date),
            addDataState.inputs.Date,
            addDataState.inputs.Time,
            addDataState.inputs.Payment,
            addDataState.inputs.Category,
            addDataState.inputs.Amount.length == 0
              ? 0.0
              : Math.round(parseFloat(addDataState.inputs.Amount) * 100) / 100,
            addDataState.inputs.Note.trim(),
            addDataState.inputs.Description.trim(),
          ),
        );
        await dispatch(AddDataActions.fetchData());
      } catch (error) {
        setError(error.message);
        console.log('Im error for different dates: ', error.message);
      }
      setIsLoading(false);
      setNav(true);
    }
  };

  const displayCategoryItems = () => {
    if (props.title === 'Income') {
      return props.categoryItemsIncome;
    } else if (props.title === 'Expense') {
      return props.categoryItemsExpense;
    } else {
      return props.paymentItems;
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.leftContainer}>
            <Text style={{paddingBottom: 40, color: 'grey'}}>Date*</Text>
            {transfer ? (
              <Text style={{paddingBottom: 40, color: 'grey'}}>From*</Text>
            ) : (
              <Text style={{paddingBottom: 40, color: 'grey'}}>Payment*</Text>
            )}
            {transfer ? (
              <Text style={{paddingBottom: 35, color: 'grey'}}>To*</Text>
            ) : (
              <Text style={{paddingBottom: 35, color: 'grey'}}>Category*</Text>
            )}
            <Text style={{paddingBottom: 30, color: 'grey'}}>Amount</Text>
            <Text style={{color: 'grey'}}>Note</Text>
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.dateAndTime}>
              <TouchableOpacity
                onPress={() => {
                  showDatePicker();
                  hideCategoryodal();
                  hidePaymentModal();
                }}>
                <Text style={{paddingRight: 20}}>
                  {addDataState.inputs.Date.toDateString()}
                </Text>
              </TouchableOpacity>
              <DateTimePicker
                date={addDataState.inputs.Date}
                //  style={{width: 320, backgroundColor: "white"}}
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                display="default"
                // onChange = {onChange}
              />
              <TouchableOpacity
                onPress={() => {
                  showTimePicker();
                  hideCategoryodal();
                  hidePaymentModal();
                }}>
                <Text>
                  {addDataState.inputs.Time.toLocaleTimeString().substring(
                    0,
                    5,
                  )}
                </Text>
              </TouchableOpacity>
              <DateTimePicker
                date={addDataState.inputs.Time}
                isVisible={isTimePickerVisible}
                mode="time"
                is24Hour={true}
                display="default"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                displayPaymentModal();
                hideCategoryodal();
              }}
              style={{
                borderBottomWidth: 1,
                marginTop: moderateScale(30),
                borderColor: isPaymentModalVisible ? '#DC143C' : 'lightgrey',
              }}>
              <Text style={{paddingBottom: moderateScale(5)}}>
                {addDataState.inputs.Payment}
              </Text>
            </TouchableOpacity>
            {transfer ? (
              <TouchableOpacity
                onPress={() => {
                  displayCategoryModal();
                  hidePaymentModal();
                }}
                style={{
                  borderBottomWidth: 1,
                  marginTop: moderateScale(30),
                  borderColor: isCategoryModalVisible ? '#DC143C' : 'lightgrey',
                }}>
                <Text style={{paddingBottom: moderateScale(5)}}>
                  {addDataState.inputs.Category}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  displayCategoryModal();
                  hidePaymentModal();
                }}
                style={{
                  borderBottomWidth: 1,
                  marginTop: moderateScale(30),
                  borderColor: isCategoryModalVisible ? '#DC143C' : 'lightgrey',
                }}>
                <Text style={{paddingBottom: moderateScale(5)}}>
                  {addDataState.inputs.Category}
                </Text>
              </TouchableOpacity>
            )}
            <TextInput
              {...props}
              onFocus={() => {
                showFocusAmount();
                hideCategoryodal();
                hidePaymentModal();
              }}
              onBlur={hideFocusAmount}
              // onTouchStart={() => {
              //   hideCategoryodal();
              //   hidePaymentModal();
              // }}
              keyboardType="decimal-pad"
              style={{
                ...styles.textInput,
                borderBottomColor: onFocusAmount ? '#DC143C' : 'lightgrey',
                marginTop: moderateScale(13),
                paddingBottom: moderateScale(0),
              }}
              value={addDataState.inputs.Amount}
              onChangeText={textChangeHandler.bind(this, 'Amount')}
            />
            <TextInput
              {...props}
              onFocus={() => {
                hideCategoryodal();
                hidePaymentModal();
                showFocusNote();
              }}
              onBlur={hideFocusNote}
              //multiline={true}
              style={{
                ...styles.textInput,
                borderBottomColor: onFocusNote ? '#DC143C' : 'lightgrey',
                marginTop: moderateScale(10),
                paddingBottom: moderateScale(0),
              }}
              value={addDataState.inputs.Note}
              onChangeText={textChangeHandler.bind(this, 'Note')}
            />
          </View>
        </View>
        <View
          style={{
            paddingTop: 25,
            borderBottomColor: '#ECECEC',
            borderBottomWidth: 10,
          }}
        />
        <TextInput
          {...props}
          onFocus={() => {
            hideCategoryodal();
            hidePaymentModal();
            showFocusDescription();
          }}
          onBlur={hideFocusDescription}
          multiline={true}
          placeholder="Description"
          style={{
            ...styles.textInput,
            borderBottomColor: onFocusDescription ? '#DC143C' : 'lightgrey',
            marginHorizontal: moderateScale(10),
            marginTop: moderateScale(5),
            paddingBottom: moderateScale(2),
          }}
          value={addDataState.inputs.Description}
          onChangeText={textChangeHandler.bind(this, 'Description')}
        />
        {isLoading ? (
          <View style={styles.loadingIndicatorStyle}>
            <ActivityIndicator size="small" color="white" />
          </View>
        ) : (
          <View style={styles.customButton}>
            <CustomButton onSave={saveHandler}>Save</CustomButton>
          </View>
        )}
        <View style={{height: 60}} />
      </ScrollView>

      {isPaymentModalVisible ? (
        <View style={styles.modalViewContainer}>
          <View style={styles.innerModalView}>
            <Text style={styles.modalText}>Payment</Text>
            <Icon
              name="cross"
              size={20}
              color="white"
              onPress={hidePaymentModal}
            />
          </View>
          <View>
            <FlatList
              keyExtractor={(item, index) => index}
              data={props.paymentItems}
              numColumns={3}
              renderItem={(itemData) => {
                return (
                  <CustomModalGridView
                    key={new Date().getTime()}
                    item={itemData.item}
                    selectedItem={textChangeHandler.bind(this, 'Payment')}
                  />
                );
              }}
            />
          </View>
        </View>
      ) : null}

      {isCategoryModalVisible ? (
        <View style={styles.modalViewContainer}>
          <View style={styles.innerModalView}>
            <Text style={styles.modalText}>Category</Text>
            <Icon
              name="cross"
              size={20}
              color="white"
              onPress={hideCategoryodal}
            />
          </View>
          <View style={{marginBottom: 50}}>
            <FlatList
              keyExtractor={(item, index) => index}
              data={displayCategoryItems()}
              numColumns={3}
              renderItem={(itemData) => {
                return (
                  <CustomModalGridView
                    key={new Date().getTime()}
                    item={itemData.item}
                    navigation={props.navigation}
                    selectedItem={textChangeHandler.bind(this, 'Category')}
                  />
                );
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  leftContainer: {
    marginLeft: '15@ms',
    marginTop: '35@ms',
  },

  rightContainer: {
    marginTop: '35@ms',
    marginRight: '15@ms',
    width: '70%',
  },

  textInput: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: '1@ms',
  },

  customButton: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '40@ms',
  },

  dateAndTime: {
    flexDirection: 'row',
  },

  loadingIndicatorStyle: {
    borderRadius: '20@ms',
    backgroundColor: '#DC143C',
    marginTop: '40@ms',
    margin: '110@ms',
    padding: '13@ms',
  },

  modalViewContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  modalText: {
    color: 'white',
  },

  innerModalView: {
    flexDirection: 'row',
    paddingVertical: '12@ms',
    paddingHorizontal: '10@ms',
    backgroundColor: 'black',
    width: '100%',
    justifyContent: 'space-between',
  },
});

export default AddDataTemplate;
