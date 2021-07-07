import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Colors from '../Constants/Colors';
import {createStackNavigator} from 'react-navigation-stack';
import DailyScreen from '../Screens/DailyScreen';
import WeeklyScreen from '../Screens/WeeklyScreen';
import AddDataScreen from '../Screens/AddDataScreen';
import EditDataScreen from '../Screens/EditDataScreen';
import MonthlyScreen from '../Screens/MonthlyScreen';
import CalendarScreen from '../Screens/CalendarScreen';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';

const DailyNavigator = createStackNavigator({
  Daily: {
    screen: DailyScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  // AddData: AddDataScreen,
  // EditData: {
  //     screen: EditDataScreen,
  //     navigationOptions: {
  //         headerShown: true
  //     }
  // },
});

const WeeklyNavigator = createStackNavigator({
  Weekly: {
    screen: WeeklyScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const MonthlyNavigator = createStackNavigator({
  Monthly: {
    screen: MonthlyScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const CalendarNavigator = createStackNavigator({
  Calendar: {
    screen: CalendarScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const TransactionsTopBar = createMaterialTopTabNavigator(
  {
    Daily: DailyScreen,
    Calendar: CalendarScreen,
    Weekly: WeeklyScreen,
    Monthly: MonthlyScreen,
  },
  {
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'black',
      indicatorStyle: {
        backgroundColor: Colors.primaryColor,
      },
      labelStyle: {
        fontFamily: 'OpenSans-Bold',
        fontSize: moderateScale(10),
      },
      showIcon: false,
      showLabel: true,
      upperCaseLabel: false,
      style: {
        backgroundColor: 'white',
      },
    },
    lazy: true,
    //optimizationsEnabled: true,
    // removeClippedSubviews: true,
    swipeEnabled: true,
  },
);

const MainNavigator = createStackNavigator({
  TopBar: {
    screen: TransactionsTopBar,
    navigationOptions: {
      headerShown: false,
    },
  },
  AddData: AddDataScreen,
  EditData: EditDataScreen,
});

export default createAppContainer(MainNavigator);
