import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions} from 'react-native';

import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import Svg from 'react-native-svg';
import {
  VictoryBar,
  VictoryTooltip,
  VictoryTheme,
  VictoryChart,
  VictoryGroup,
  VictoryAxis,
} from 'victory-native';

const BarChart = (props) => {
  const [months, setMonths] = useState([]);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const chartData = props.chartData;
  const monthInWords = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const converter = (n) => {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
  };

  const selectMonth = (name, pos) => {
    console.log('Im select month', name, pos, chartData);
    if (
      months &&
      months.some((data, index) => data === true && index === pos)
    ) {
      setMonths(months.map((data, index) => (index === pos ? false : data)));

      return;
    }
    if (months && months.some((data, index) => data === true && index != pos)) {
      setMonths(months.map((data, index) => (index === pos ? true : false)));
      return;
    }
    setMonths(chartData.map((data) => data.month === name));
  };

  useEffect(() => {
    setMonths([]);
  }, [chartData]);

  return (
    <View>
      <Svg
        style={{
          marginTop: props.marginTop,
          marginLeft: props.marginLeft,
          marginBottom: props.marginBottom,
        }}
        preserveAspectRatio="none">
        <VictoryChart
          domain={
            props.totalIncome === 0 && props.totalExpense === 0
              ? {y: [0, 6]}
              : {}
          }
          domainPadding={{y: 30, x: 20}}
          theme={VictoryTheme.material}
          height={moderateScale(windowHeight / 2.5)}
          width={windowWidth * 1.1}>
          <VictoryAxis
            tickValues={monthInWords}
            style={{
              tickLabels: {
                fontSize: moderateScale(9),
                padding: moderateScale(5),
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            offsetY={50}
            tickFormat={(tick) => `${converter(tick)}`}
            style={{
              tickLabels: {
                fontSize: moderateScale(9),
                padding: moderateScale(5),
              },
            }}
          />
          <VictoryGroup offset={-2}>
            <VictoryBar
              style={{
                data: {
                  strokeWidth: 2,
                  fill: ({datum}) =>
                    months && months[datum._x - 1] ? 'tomato' : '#ffcccb',
                },
                labels: {fill: 'white', fontFamily: 'OpenSans-Bold'},
              }}
              //barRatio={0.3}
              barWidth={10}
              x="month"
              y="expense"
              alignment="start"
              data={props.chartData}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          target: 'data',
                          mutation: (props) => {
                            let monthName = chartData[props.index].month;
                            selectMonth(monthName, props.index);
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
              labels={({datum}) =>
                months && months[datum._x - 1]
                  ? [
                      `Income: Rs ${datum.income.toFixed(2)}`,
                      `Expense: Rs ${datum.expense.toFixed(2)}`,
                    ]
                  : null
              }
              labelComponent={
                <VictoryTooltip
                  active
                  center={{
                    x: moderateScale(195),
                    y: moderateScale(35),
                  }}
                  renderInPortal={false}
                  pointerOrientation="top"
                  flyoutStyle={{
                    fill: ({datum}) =>
                      months && months[datum._x - 1] ? 'tomato' : 'transparent',
                    stroke: 'none',
                  }}
                  flyoutPadding={{
                    top: moderateScale(6),
                    bottom: moderateScale(6),
                    left: moderateScale(8),
                    right: moderateScale(8),
                  }}
                  constrainToVisibleArea
                />
              }
            />
            <VictoryBar
              //horizontal
              // name="bar-1"
              style={{
                data: {
                  strokeWidth: 2,
                  fill: ({datum}) =>
                    months && months[datum._x - 1] ? '#1E90FF' : '#95beff',
                },
                labels: {fill: 'white', fontFamily: 'OpenSans-Bold'},
              }}
              //barRatio={0.3}
              barWidth={10}
              x="month"
              y="income"
              alignment="end"
              data={props.chartData}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          target: 'data',
                          mutation: (props) => {
                            let monthName = chartData[props.index].month;
                            selectMonth(monthName, props.index);
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
              labels={({datum}) =>
                months && months[datum._x - 1]
                  ? [
                      `Income: Rs ${datum.income.toFixed(2)}`,
                      `Expense: Rs ${datum.expense.toFixed(2)}`,
                    ]
                  : null
              }
              labelComponent={
                <VictoryTooltip
                  active
                  center={{
                    x: moderateScale(195),
                    y: moderateScale(35),
                  }}
                  renderInPortal={false}
                  pointerOrientation="top"
                  flyoutStyle={{
                    fill: ({datum}) =>
                      months && months[datum._x - 1] ? 'tomato' : 'transparent',
                    stroke: 'none',
                  }}
                  flyoutPadding={{
                    top: moderateScale(6),
                    bottom: moderateScale(6),
                    left: moderateScale(8),
                    right: moderateScale(8),
                  }}
                  constrainToVisibleArea
                />
              }
            />
          </VictoryGroup>
        </VictoryChart>
      </Svg>
    </View>
  );
};

export default BarChart;
