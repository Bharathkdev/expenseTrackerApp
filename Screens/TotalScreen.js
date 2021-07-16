import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {useSelector} from 'react-redux';
import CommonAmountHeader from '../Components/CommonAmountHeader';

const TotalScreen = (props) => {
  return (
    <View style={styles.chartContainer}>
      {/* <Svg>
          <VictoryChart
            theme={VictoryTheme.material}
            // animate={{
            //   duration: 2000,
            //   onLoad: {duration: 1000},
            // }}
            // containerComponent={
            //   <VictoryVoronoiContainer label={({datum}) => `${datum.total}`} />
            // }
            ontainerComponent={
              <VictoryVoronoiContainer
                voronoiDimension="x"
                labels={({datum}) => `${datum.total}`}
                labelComponent={
                  <VictoryTooltip
                    cornerRadius={0}
                    flyoutStyle={{fill: 'white'}}
                  />
                }
              />
            }
            height={250}
            width={windowWidth}>
            <VictoryLine
              data={chartData}
              // labels={({datum}) => {
              //   // months && months[datum._x - 1]
              //   `Rs ${datum.total.toFixed(2)}`;
              // }}
              x="month"
              y="total"
              style={{
                data: {stroke: 'tomato', strokeWidth: 3},
                parent: {border: '2px solid blue'},
              }}
              labelComponent={
                <VictoryTooltip
                  active
                  renderInPortal={false}
                  //labelPlacement="perpendicular"
                  //pointerLength={20}
                  pointerWidth={0}
                  flyoutPadding={{top: 10, bottom: 10, left: 10, right: 10}}
                  flyoutStyle={{
                    //stroke: ({datum}) => graphicColor[datum._x - 1],
                    stroke: 'black',
                    strokeWidth: 2,
                    //fill: ({datum}) => graphicColor[datum._x - 1],
                    fill: 'white',
                  }}
                  style={{
                    fill: 'black',
                    fontSize: 10,
                    //fontSize: 12,
                    fontFamily: 'OpenSans-Bold',
                  }}
                  constrainToVisibleArea
                  //labelComponent={
                  //     // <VictoryLabel
                  //     //   renderInPortal
                  //     //   // verticalAnchor="end"
                  //     //   // backgroundPadding={8}
                  //     //   // borderRadius={10}
                  //     // />
                />
              }
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          target: 'label',
                          eventKey: 'all',
                          mutation: (props, {data}) => {
                            console.log('Chart data month: ', props, data);
                            // let selectedMonth = chartData[index].month;
                            // selectMonth(selectedMonth, index);
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
              //   events={[
              //     {
              //       target: 'data',
              //       eventHandlers: {
              //         onPressIn: () => {
              //           return [
              //             {
              //               target: 'data',
              //               eventKey: 'all',
              //               mutation: ({style}) => {
              //                 return style.stroke === 'black'
              //                   ? null
              //                   : {style: {stroke: 'black', strokeWidth: 5}};
              //               },
              //             },
              //           ];
              //         },
              //       },
              //     },
              //   ]}
            />
          </VictoryChart> */}
      {/* </Svg> */}
      <VictoryChart
        domain={totalAmount === 0 ? {y: [0, 10]} : {}}
        domainPadding={{y: 50, x: 20}}
        theme={VictoryTheme.material}
        animate={{
          duration: 2000,
          onLoad: {duration: 1000},
        }}
        containerComponent={
          <VictoryVoronoiContainer
          // labels={({datum}) => `Rs ${datum.total}`}
          // labelComponent={
          //   <VictoryTooltip
          //     cornerRadius={5}
          //     flyoutStyle={{fill: 'tomato', stroke: 'tomato'}}
          //   />
          // }
          />
        }
        height={250}
        width={windowWidth * 1.08}>
        <VictoryGroup>
          <VictoryLine
            data={chartData}
            x="month"
            y="total"
            // style={{
            //   data: {
            //     stroke: 'tomato',
            //     strokeWidth: 2,
            //     fontSize: 5,
            //   },
            // }}
            // events={[
            //   {
            //     target: 'data',
            //     eventHandlers: {
            //       onPressIn: () => {
            //         return [
            //           {
            //             target: 'data',
            //             eventKey: 'all',
            //             mutation: ({style}) => {
            //               return style.stroke === 'green'
            //                 ? null
            //                 : {style: {stroke: 'green', strokeWidth: 5}};
            //             },
            //           },
            //         ];
            //       },
            //     },
            //   },
            // ]}
          />
          <VictoryScatter
            labels={({datum}) => `Rs ${datum.total.toFixed(2)}`}
            labelComponent={
              <VictoryTooltip
                renderInPortal={false}
                cornerRadius={5}
                flyoutStyle={{fill: 'tomato', stroke: 'tomato'}}
                flyoutPadding={{top: 10, bottom: 10, left: 10, right: 10}}
              />
            }
            style={{
              data: {
                stroke: 'tomato',
                strokeWidth: 2,
              },
              labels: {fill: 'white', fontFamily: 'OpenSans-Bold'},
            }}
            color="white"
            data={chartData}
            x="month"
            y={(datum) => datum.total}
            // events={[
            //   {
            //     target: 'data',
            //     eventHandlers: {
            //       onPressIn: () => {
            //         return [
            //           {
            //             target: 'data',
            //             mutation: (props) => {
            //               const fill = props.style && props.style.fill;
            //               return fill === 'black'
            //                 ? null
            //                 : {style: {fill: 'black'}};
            //             },
            //           },
            //           {
            //             target: 'labels',
            //             mutation: (props) => {
            //               return props.text === 'clicked'
            //                 ? null
            //                 : {text: 'clicked'};
            //             },
            //           },
            //         ];
            //       },
            //     },
            //   },
            // ]}
          />
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default TotalScreen;
