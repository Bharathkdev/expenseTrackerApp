import React, {useState} from 'react';
import {View, Text, FlatList, Dimensions, ImageBackground} from 'react-native';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import {
  VictoryPie,
  Slice,
  datum,
  VictoryLabel,
  Rect,
  Flyout,
  VictoryTooltip,
  VictoryTheme,
} from 'victory-native';
import Svg from 'react-native-svg';
import StatisticsList from './StatisticsList';
import Popover from 'react-native-popover-view';

const StatisticsTemplate = (props) => {
  const graphicData = props.data;
  const graphicColor = [
    'tomato',
    'orange',
    'gold',
    'lightgreen',
    'cornflowerblue',
    'turquoise',
    '#C9EE82',
    '#E97451',
    '#CD5C5C',
    '#0095B7',
    '#4A646C',
    '#FFCBA4',
  ];

  const windowWidth = Dimensions.get('window').width;
  let category = [];

  const setInSelectCategoryByName = (name, pos) => {
    if (
      category &&
      category.some((data, index) => data === true && index === pos)
    ) {
      category = category.map((data, index) =>
        index === pos ? (data = false) : data,
      );
      return;
    }
    if (
      category &&
      category.some((data, index) => data === true && index != pos)
    ) {
      category = category.map((data) =>
        data === true ? (data = false) : data,
      );
      category = category.map((data, index) =>
        index === pos ? (data = true) : data,
      );
      return;
    }
    category = graphicData.map((data) => data.category === name);
  };

  return (
    <View style={{flex: 1}}>
      {props.data.length === 0 ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ImageBackground
            style={styles.image}
            resizeMode="contain"
            source={{
              uri:
                'https://image.freepik.com/free-vector/no-data-concept-illustration_114360-2506.jpg',
            }}>
            <Text style={styles.noDataText}>No Data Found!</Text>
          </ImageBackground>
        </View>
      ) : (
        <>
          <View style={styles.chartContainer}>
            <Svg
              //viewBox={'0 0' + ' ' + windowWidth + ' ' + windowHeight}
              style={{width: windowWidth, height: 350}}
              preserveAspectRatio="none">
              <VictoryPie
                standalone={false}
                //animate={{easing: 'cubic'}}
                //fixLabelOverlap={true}
                //animate={{duration: 2000, easing: 'bounce'}}
                //animate={{easing: 'onEnd'}}
                // startAngle={90}
                // endAngle={450}
                // data={[
                //   {category: 'Others', amount: 200},
                //   {category: 'HouseHold', amount: 2000},
                // ]}
                data={graphicData}
                // width={250}
                // height={250}
                x="category"
                y="amount"
                colorScale={graphicColor}
                //innerRadius={graphicData.length > 4 ? 30 : 40}
                innerRadius={70}
                //labels={() => null}
                labels={({datum}) =>
                  props.total === 0
                    ? null
                    : category && category[datum._x - 1]
                    ? [
                        `${datum.category}`,
                        datum.amount === 0
                          ? '0.0%'
                          : `${Math.round(
                              (datum.amount / props.total) * 100,
                            ).toString()}%`,
                      ]
                    : null
                }
                //backgroundComponent={<Rect height={100} />}
                // radius={({datum}) =>
                //   category && category[datum._x - 1]
                //     ? graphicData.length > 4
                //       ? 90
                //       : 110
                //     : graphicData.length > 4
                //     ? 80
                //     : 100
                // }
                radius={({datum}) =>
                  category && category[datum._x - 1] ? 140 : 130
                }
                // domainPadding={50}
                width={windowWidth}
                height={350}
                style={{
                  data: {
                    stroke: 'white',
                    strokeWidth: 0,
                  },
                  labels: {
                    //padding: 15,
                    //fontSize: ({datum}) => (datum.category.length > 10 ? 7 : 10),
                    fontSize: 12,
                    fontFamily: 'OpenSans-Bold',
                  },
                  parent: {
                    overflow: 'visible',
                    elevation: 20,
                    border: '3px solid #ccc',
                  },
                }}
                labelRadius={({innerRadius}) => innerRadius + 5}
                labelPlacement={'parallel'}
                labelComponent={
                  <VictoryTooltip
                    active
                    renderInPortal={false}
                    labelPlacement="perpendicular"
                    pointerLength={20}
                    pointerWidth={0}
                    flyoutPadding={{top: 10, bottom: 10, left: 10, right: 10}}
                    // borderColor="white"
                    flyoutStyle={{
                      //stroke: ({datum}) => graphicColor[datum._x - 1],
                      stroke: 'white',
                      strokeWidth: 2,
                      //fill: ({datum}) => graphicColor[datum._x - 1],
                      fill: 'white',
                    }}
                    style={{
                      fill: 'black',
                      // fontSize: ({datum}) =>
                      //   datum.category.length > 10 ? 8 : 10,
                      fontSize: 10,
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
                // //labelPosition="endAngle"
                // startAngle={130}
                // endAngle={600}
                // padAngle={0}
                //
                //labelRadius={graphicData.length > 4 ? 85 : 110}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPressIn: () => {
                        return [
                          {
                            target: 'data',
                            mutation: (props) => {
                              console.log('Pie chart: ', props, props.index);
                              let categoryName =
                                graphicData[props.index].category;
                              setInSelectCategoryByName(
                                categoryName,
                                props.index,
                              );
                            },
                          },
                        ];
                      },
                    },
                  },
                ]}
              />
            </Svg>
            <View
              style={{
                position: 'absolute',
                top: '40%',
              }}>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{
                  textAlign: 'center',
                  fontSize: moderateScale(25),
                  fontFamily: 'OpenSans-Bold',
                  color: 'black',
                  paddingHorizontal: 10,
                }}>
                {graphicData.length}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                top: '50%',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: moderateScale(13),
                  fontFamily: 'OpenSans-Regular',
                  color: 'black',
                }}>
                {props.type === 'Income'
                  ? graphicData.length === 1
                    ? 'Income'
                    : 'Incomes'
                  : graphicData.length === 1
                  ? 'Expense'
                  : 'Expenses'}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: '#E8E8E8',
              borderBottomWidth: 7,
              marginTop: 0,
            }}
          />
          <View style={{flex: 1, marginBottom: moderateScale(5)}}>
            <FlatList
              keyExtractor={(item) => item.category}
              data={props.data}
              renderItem={({item, index}) => {
                return (
                  <StatisticsList
                    key={new Date().getTime()}
                    dataDetails={item}
                    total={props.total}
                    color={graphicColor}
                    index={index}
                    type={props.type}
                    navigation={props.navigation}
                  />
                );
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = ScaledSheet.create({
  chartContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffeece',
  },

  noDataText: {
    textAlign: 'center',
    paddingTop: '220@ms',
    color: '#FFD586',
    fontSize: '20@ms',
    fontFamily: 'OpenSans-Regular',
  },

  image: {
    height: '70%',
    width: '100%',
  },
});

export default StatisticsTemplate;
