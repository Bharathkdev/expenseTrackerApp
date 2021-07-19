import React from 'react';
import {Text} from 'react-native';
import {createAppContainer, StackActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import TransactionsScreen from '../Screens/TransactionsScreen';
import StatisticsScreen from '../Screens/StatisticsScreen';
import AccountsScreen from '../Screens/AccountsScreen';
import Colors from '../Constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddDataScreen from '../Screens/AddDataScreen';
import EditDataScreen from '../Screens/EditDataScreen';
import CategoryScreen from '../Screens/CategoryScreen';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';

const TransactionsNavigator = createStackNavigator({
  Transactions: TransactionsScreen,
  AddData: AddDataScreen,
});

TransactionsNavigator.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName != 'Transactions') {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const StatisticsNavigator = createStackNavigator({
  Statistics: StatisticsScreen,
  Category: CategoryScreen,
  AddData: AddDataScreen,
  EditData: EditDataScreen,
});

StatisticsNavigator.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName;

  if (routeName != 'Statistics') {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const AccountsNavigator = createStackNavigator({
  Accounts: AccountsScreen,
});

const BottomTabScreenConfig = {
  Transactions: {
    screen: TransactionsNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return (
          <MaterialCommunityIcons
            name="bank-transfer"
            size={moderateScale(28)}
            color={tabInfo.tintColor}
          />
        );
      },
      tabBarLabel: (tabInfo) => (
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'OpenSans-Bold',
            fontSize: 12,
            color: tabInfo.tintColor,
            paddingBottom: moderateScale(5),
          }}>
          Transactions
        </Text>
      ),
    },
  },

  Statistics: {
    screen: StatisticsNavigator,
    navigationOptions: ({navigation}) => ({
      tabBarIcon: (tabInfo) => {
        return (
          <MaterialIcons
            name="analytics"
            size={moderateScale(20)}
            color={tabInfo.tintColor}
          />
        );
      },
      tabBarLabel: (tabInfo) => (
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'OpenSans-Bold',
            fontSize: 12,
            color: tabInfo.tintColor,
            paddingBottom: moderateScale(5),
          }}>
          Statistics
        </Text>
      ),
    }),
  },

  Accounts: {
    screen: AccountsNavigator,
    navigationOptions: ({navigation}) => ({
      tabBarIcon: (tabInfo) => {
        return (
          <MaterialIcons
            name="account-balance-wallet"
            size={moderateScale(20)}
            color={tabInfo.tintColor}
          />
        );
      },
      tabBarLabel: (tabInfo) => (
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'OpenSans-Bold',
            fontSize: 12,
            color: tabInfo.tintColor,
            paddingBottom: moderateScale(5),
          }}>
          Accounts
        </Text>
      ),
    }),
  },
};

const BottomTabs = createBottomTabNavigator(BottomTabScreenConfig, {
  tabBarOptions: {
    activeTintColor: Colors.primaryColor,
    style: {
      backgroundColor: 'white',
      paddingVertical: moderateScale(10),
      height: moderateScale(55),
    },
  },
  // tabBarVisible: fetchVisibility ? false : true,
});

export default createAppContainer(BottomTabs);
