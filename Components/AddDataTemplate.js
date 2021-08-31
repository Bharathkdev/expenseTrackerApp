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
  Button,
  TextInput,
  Alert,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import CustomButton from './CustomButton';
import DateTimePicker from 'react-native-modal-datetime-picker';

import {useSelector, useDispatch} from 'react-redux';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Entypo';
import CustomModalGridView from './CustomModalGridView';
import Colors from '../Constants/Colors';
import BouncingLoader from './BouncingLoader';

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
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  let color;
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
      dispatch(AddDataActions.updateVisibility(true, false));

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
      Category: dataID
        ? props.details.category
        : props.category
        ? props.category
        : '',
      Amount: dataID
        ? props.details.amount.toFixed(2)
        : // .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')
          '',
      Note: dataID ? props.details.note : '',
      Description: dataID ? props.details.description : '',
    },
    inputValidations: {
      Date: true,
      Payment: dataID ? true : false,
      Category: dataID ? true : props.category ? true : false,
    },
    formValidation: dataID ? true : false,
  });

  console.log('Add dat details: ', addDataState.inputs);

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

        if (
          text.length != 1 &&
          text.charAt(0) === '0' &&
          text.charAt(1) != '.'
        ) {
          text = text.slice(1, text.length);
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

  const backHandler = () => {
    dispatch(
      AddDataActions.updateVisibility(true, visibilityData.editDataVisible),
    );
    props.navigation.goBack();
  };

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
        setNav(true);
      } catch (error) {
        setError(error.message);
      }
      if (props.mounted) {
        setIsLoading(false);
      }
      console.log('After reducer add data screen called');
    } else if (dataID == null) {
      setError(null);
      setIsLoading(true);
      try {
        if (
          dataItems &&
          dataItems[year] &&
          dataItems[year][month] &&
          dataItems[year][month][dateInString]
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
          dispatch(
            AddDataActions.updateMonthYearFilter(
              addDataState.inputs.Date.getMonth(),
              addDataState.inputs.Date.getFullYear(),
            ),
          );
          setNav(true);
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
        dispatch(
          AddDataActions.updateMonthYearFilter(
            addDataState.inputs.Date.getMonth(),
            addDataState.inputs.Date.getFullYear(),
          ),
        );
        setNav(true);
      } catch (error) {
        setError(error.message);
        console.log('error in add template: ', error.message);
      }
      if (props.mounted) {
        setIsLoading(false);
      }
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
        dispatch(
          AddDataActions.updateMonthYearFilter(
            addDataState.inputs.Date.getMonth(),
            addDataState.inputs.Date.getFullYear(),
          ),
        );
        setNav(true);
      } catch (error) {
        setError(error.message);
        console.log('Im error for different dates: ', error.message);
      }
      if (props.mounted) {
        setIsLoading(false);
      }
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

  if (props.title === 'Income') {
    color = '#1E90FF';
  } else if (props.title === 'Expense') {
    color = '#DC143C';
  } else {
    color = 'black';
  }

  if (error) {
    return (
      <View style={styles.centerLoader}>
        {error === 'Network request failed' ? (
          <ImageBackground
            style={styles.noNetworkImage}
            resizeMode="contain"
            source={require('../assets/images/noInternet.jpg')}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginBottom: moderateScale(100),
              }}>
              <Button
                title="Go Back"
                color={Colors.primaryColor}
                onPress={backHandler}
              />
            </View>
          </ImageBackground>
        ) : (
          <>
            <Text style={{marginBottom: moderateScale(10)}}>
              Something went wrong!!
            </Text>
            <Button
              title="Go Back"
              color={Colors.primaryColor}
              onPress={backHandler}
            />
          </>
        )}
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <BouncingLoader />
        </View>
      ) : (
        <ScrollView style={{flex: 1}}>
          <View style={{...styles.container}}>
            <View
              style={{
                marginTop: moderateScale(windowHeight * 0.04),
                marginHorizontal: moderateScale(windowWidth * 0.04),
              }}>
              <Text
                style={{
                  paddingBottom: moderateScale(windowWidth * 0.08),
                  color: 'grey',
                }}>
                Date
              </Text>
              {transfer ? (
                <Text
                  style={{
                    paddingBottom: moderateScale(windowWidth * 0.08),
                    color: 'grey',
                  }}>
                  From*
                </Text>
              ) : (
                <Text
                  style={{
                    paddingBottom: moderateScale(windowWidth * 0.08),
                    color: 'grey',
                  }}>
                  Payment*
                </Text>
              )}
              {transfer ? (
                <Text
                  style={{
                    paddingBottom: moderateScale(windowWidth * 0.08),
                    color: 'grey',
                  }}>
                  To*
                </Text>
              ) : (
                <Text
                  style={{
                    paddingBottom: moderateScale(windowWidth * 0.08),
                    color: 'grey',
                  }}>
                  Category*
                </Text>
              )}
              <Text
                style={{
                  paddingBottom: moderateScale(windowWidth * 0.08),
                  color: 'grey',
                }}>
                Amount
              </Text>
              <Text style={{color: 'grey'}}>Note</Text>
            </View>
            <View
              style={{
                width: windowWidth * 0.72,
                marginTop: windowHeight * 0.043,
                marginRight: windowWidth * 0.04,
              }}>
              <View
                style={{
                  ...styles.dateAndTime,
                  marginBottom: moderateScale(windowWidth * 0.07),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    showDatePicker();
                    hideCategoryodal();
                    hidePaymentModal();
                  }}>
                  <Text style={{paddingRight: moderateScale(20)}}>
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
                  marginBottom: moderateScale(windowWidth * 0.07),
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
                    marginBottom: moderateScale(windowWidth * 0.035),
                    borderColor: isCategoryModalVisible
                      ? '#DC143C'
                      : 'lightgrey',
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
                    marginBottom: moderateScale(windowWidth * 0.035),
                    borderColor: isCategoryModalVisible
                      ? '#DC143C'
                      : 'lightgrey',
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
                placeholder="0.00"
                keyboardType="decimal-pad"
                //caretHidden={true}
                style={{
                  ...styles.textInput,
                  borderBottomColor: onFocusAmount ? '#DC143C' : 'lightgrey',
                  borderBottomWidth: 1,
                  paddingBottom: moderateScale(0),
                  marginBottom: moderateScale(windowWidth * 0.03),
                }}
                value={addDataState.inputs.Amount}
                onChangeText={textChangeHandler.bind(this, 'Amount')}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  marginTop: moderateScale(windowHeight * 0.18),
                  marginLeft: moderateScale(windowWidth * 0.59),
                }}>
                <Icon
                  name="circle-with-cross"
                  size={moderateScale(20)}
                  color="black"
                  onPress={textChangeHandler.bind(this, 'Amount', '')}
                />
              </TouchableOpacity>
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
                  borderBottomWidth: moderateScale(1),
                  borderBottomColor: onFocusNote ? '#DC143C' : 'lightgrey',
                  marginBottom: moderateScale(windowWidth * 0.005),
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
          <View style={{...styles.customButton, paddingTop: moderateScale(40)}}>
            <CustomButton style={{backgroundColor: color}} onSave={saveHandler}>
              Save
            </CustomButton>
          </View>
          <View style={{...styles.customButton, paddingTop: moderateScale(10)}}>
            <CustomButton
              style={{backgroundColor: '#696969'}}
              onSave={backHandler}>
              Back
            </CustomButton>
          </View>
          <View style={{height: 40}} />
        </ScrollView>
      )}

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

  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textInput: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: '1@ms',
  },

  customButton: {
    flex: 1,
    alignItems: 'center',
  },

  dateAndTime: {
    flexDirection: 'row',
  },

  modalViewContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  modalText: {
    color: 'white',
  },

  noNetworkImage: {
    height: '100%',
    width: '100%',
    marginBottom: '100@ms',
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
