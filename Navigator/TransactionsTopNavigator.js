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
import TotalScreen from '../Screens/TotalScreen';

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
  Weekly: {
    screen: MonthlyScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const CalendarNavigator = createStackNavigator({
  Weekly: {
    screen: CalendarScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const TotalNavigator = createStackNavigator({
  Weekly: {
    screen: TotalScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const TransactionsTopBar = createMaterialTopTabNavigator(
  {
    Daily: DailyNavigator,
    Calendar: CalendarNavigator,
    Weekly: WeeklyNavigator,
    Monthly: MonthlyNavigator,
    Total: TotalNavigator,
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
        fontSize: 12,
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
