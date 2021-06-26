import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const StatisticsScreen = props => {
    return (
        <View>
            <Text>This is Statistics Screen!!</Text>
        </View>
    );
};

StatisticsScreen.navigationOptions = (navData) => {


    return {
        headerTitle: 'Statistics'
    }
};

const styles = StyleSheet.create({});

export default StatisticsScreen;