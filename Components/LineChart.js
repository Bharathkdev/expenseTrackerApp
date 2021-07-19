import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {baseProps} from 'react-native-gesture-handler/dist/src/handlers/gestureHandlers';

import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import {
  VictoryLine,
  VictoryTooltip,
  VictoryTheme,
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryScatter,
  VictoryAxis,
} from 'victory-native';

const LineChart = (props) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const converter = (n) => {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
  };

  console.log('Line chart view', props.totalIncome, props.totalExpense);

  return (
    <View>
      <VictoryChart
        domain={props.total === 0 ? {y: [0, 6]} : {}}
        domainPadding={{y: 30, x: 20}}
        theme={VictoryTheme.material}
        style={{
          parent: {
            marginTop: props.marginTop,
            marginLeft: props.marginLeft,
            marginBottom: props.marginBottom,
          },
        }}
        containerComponent={<VictoryVoronoiContainer />}
        height={moderateScale(windowHeight / 3.4)}
        width={windowWidth * 1.1}>
        <VictoryAxis
          standalone={false}
          offsetY={50}
          tickValues={[
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
          ]}
          style={{
            tickLabels: {fontSize: moderateScale(9), padding: moderateScale(5)},
          }}
        />
        <VictoryAxis
          standalone={false}
          dependentAxis
          tickFormat={(tick) =>
            tick < 0 ? `-${converter(Math.abs(tick))}` : `${converter(tick)}`
          }
          style={{
            tickLabels: {fontSize: moderateScale(9), padding: moderateScale(5)},
          }}
        />
        <VictoryLine
          interpolation="catmullRom"
          data={props.chartData}
          x="month"
          y="total"
          style={{
            data: {
              stroke: 'tomato',
              strokeWidth: 2,
            },
          }}
        />

        <VictoryScatter
          labels={({datum}) => `Rs ${datum.total.toFixed(2)}`}
          labelComponent={
            <VictoryTooltip
              renderInPortal={false}
              cornerRadius={5}
              flyoutStyle={{fill: 'tomato', stroke: 'tomato'}}
              flyoutPadding={{
                top: moderateScale(8),
                bottom: moderateScale(8),
                left: moderateScale(8),
                right: moderateScale(8),
              }}
              constrainToVisibleArea
            />
          }
          style={{
            data: {
              stroke: 'tomato',
              strokeWidth: 2,
              fill: 'white',
            },
            labels: {fill: 'white', fontFamily: 'OpenSans-Bold'},
          }}
          data={props.chartData}
          x="month"
          y={(datum) => datum.total}
        />
      </VictoryChart>
    </View>
  );
};

export default LineChart;
