import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';


import { useSelector } from 'react-redux';
import CommonAmountHeader from '../Components/CommonAmountHeader';

const TotalScreen = props => {

    return (
        <View style={styles.container}>
            <CommonAmountHeader totalIncomeAllDate={0} totalExpenseAllDate={0} balanceAmountAllDate={0} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});

export default TotalScreen;