import React from 'react';
import { Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import TransactionsScreen from '../Screens/TransactionsScreen';
import StatisticsScreen from '../Screens/StatisticsScreen';
import AccountsScreen from '../Screens/AccountsScreen';
import Colors from '../Constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AddDataScreen from '../Screens/AddDataScreen';
import DailyScreen from '../Screens/DailyScreen';
import WeeklyScreen from '../Screens/WeeklyScreen';
import EditDataScreen from '../Screens/EditDataScreen';



const TransactionsNavigator = createStackNavigator({
    Transactions: TransactionsScreen,
    AddData: AddDataScreen,
    EditData: EditDataScreen,
    Daily: DailyScreen,
    Weekly: WeeklyScreen,
});

const StatisticsNavigator = createStackNavigator({
    Statistics: StatisticsScreen
});

const AccountsNavigator = createStackNavigator({
    Accounts: AccountsScreen
});

const BottomTabScreenConfig = {
    Transactions: {
        screen: TransactionsNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (
                    <MaterialIcons
                        name='receipt-long'
                        size={20}
                        color={tabInfo.tintColor}
                    />
                )
            },
            tabBarLabel: <Text style={{ fontFamily: 'OpenSans-Bold' }}>Transactions</Text>
        }
    },

    Statistics: {
        screen: StatisticsNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (
                    <MaterialIcons
                        name='analytics'
                        size={20}
                        color={tabInfo.tintColor}
                    />
                )
            },
            tabBarLabel: <Text style={{ fontFamily: 'OpenSans-Bold' }}>Statistics</Text>
        }
    },

    Accounts: {
        screen: AccountsNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (
                    <MaterialIcons
                        name='account-balance'
                        size={20}
                        color={tabInfo.tintColor}
                    />
                )
            },
            tabBarLabel: <Text style={{ fontFamily: 'OpenSans-Bold' }}>Accounts</Text>
        }
    }
};

const BottomTabs = createMaterialBottomTabNavigator(BottomTabScreenConfig, {
    activeColor: Colors.primaryColor,
    shifting: true,                //gives the shifting effect
    barStyle: {
        backgroundColor: 'white'
    }
});




export default createAppContainer(BottomTabs);