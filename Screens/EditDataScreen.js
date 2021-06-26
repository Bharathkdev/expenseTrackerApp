import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Button,
    ActivityIndicator,
    Alert
} from 'react-native';
import DailyScreen from './DailyScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import * as AddDataActions from '../Store/Actions/AddDataAction';
import Colors from '../Constants/Colors';
import BouncingLoader from '../Components/BouncingLoader';

const EditDataScreen = props => {
    console.log("Im the edit data screen");

    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const selectedDataItemsList = props.navigation.getParam('selectedDataItemsList');

    const dispatch = useDispatch();
    const selectedDataItems = useSelector(state => state.data.selectedDataItems);
    const monthYearFilterData = useSelector(state => state.data.MonthYearFilter);

    let totalAmount = 0;

    for (let key of selectedDataItems) {
        if (key.type === 'Income') {
            totalAmount += key.amount;
        } else if (key.type === 'Expense') {
            totalAmount -= key.amount;
        }
    }

    console.log("Delete multipledata component: ", selectedDataItems);

    useEffect(() => {
        props.navigation.setParams({ dispatch: dispatch });
    }, [dispatch]);

    useEffect(() => {
        if (selectedDataItems.length == 0) {
            props.navigation.navigate({
                routeName: 'Daily'
            });
            dispatch(AddDataActions.updateVisibility(true, false));
        }
    }, [selectedDataItems.length])


    useEffect(() => {
        props.navigation.setParams({ deleteData: deleteMutipleData });
    }, [deleteMutipleData]);

    const deleteMutipleData = useCallback(async () => {
        console.log("Im delete mutiple data method");
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(AddDataActions.deleteMultipleData(selectedDataItems, monthYearFilterData.year, monthYearFilterData.month));

            dispatch(AddDataActions.updateVisibility(true, false));
            dispatch(AddDataActions.clearDataSelection());
        } catch (error) {
            console.log("Im delete mutiple data method error: ", error);
            setError(error.message);
        }
        props.navigation.navigate('Daily');
        setIsLoading(false);
    }, [isLoading, error, selectedDataItems.length, monthYearFilterData]);

    if (error) {
        return (
            <View style={styles.centerLoader}>
                <Text style={{ color: 'grey' }}>{error === "Network request failed" ? <Text>Check your Internet Connectivity</Text> : <Text>An error occured!!</Text>}</Text>
                <Button title='Try Again' color={Colors.primaryColor} onPress={deleteMutipleData} />
            </View>
        )
    }

    if (isLoading) {
        return (
            <BouncingLoader />
        )
    }


    return (
        <>
            <View style={styles.textViewStyle}>
                <Text style={styles.textStyle}>{selectedDataItems.length}(s) selected</Text>
                <Text style={{}} adjustsFontSizeToFit numberOfLines={1} style={styles.textStyle}>Rs. {totalAmount.toFixed(2)}</Text>
            </View>
            <DailyScreen />
        </>
    )
}

EditDataScreen.navigationOptions = navData => {

    const dispatch = navData.navigation.getParam('dispatch');
    const callDeleteMultipleData = navData.navigation.getParam('deleteData');


    return {
        headerTitle: () => <Text style={{ fontSize: 20, fontFamily: 'OpenSans-Bold' }}>Edit</Text>,
        // headerTintColor: 'white',  deleteBalanceAmountAllDateUpdate = deleteTotalIncomeAllDateUpdate - deleteTotalExpenseAllDateUpdate;

        // console.log("Amounts updated :", balanceAmountAllDateUpdate, totalIncomeAllDateUpdate, totalExpenseAllDateUpdate);
        // headerStyle: {
        //     backgroundColor: '#42526C'
        // },
        headerLeft: () => (
            <View style={styles.leftIcon}>
                <Icon
                    name='keyboard-backspace'
                    size={35}
                    color='grey'
                    onPress={() => {
                        navData.navigation.navigate('Daily');
                        dispatch(AddDataActions.updateVisibility(true, false));
                        dispatch(AddDataActions.clearDataSelection());
                    }}
                />
            </View>
        ),

        headerRight: () => (
            <View style={styles.rightIcon}>
                <Icon
                    name='delete'
                    size={30}
                    color='red'
                    onPress={() => {
                        Alert.alert('Delete Items', 'Are you sure you want to delete the selected items?', [{ text: 'No', style: 'default' },
                        {
                            text: 'Yes', style: 'destructive', onPress: callDeleteMultipleData
                        }]);;
                    }}
                />
            </View>
        )
    }
};

const styles = StyleSheet.create({
    leftIcon: {
        marginLeft: 20
    },

    rightIcon: {
        marginRight: 20
    },

    textViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 17,
        backgroundColor: '#040720'
    },

    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    textStyle: {
        color: 'white'
    }
});

export default EditDataScreen;