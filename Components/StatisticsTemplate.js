import React from 'react';
import {View, Text, FlatList, Dimensions} from 'react-native';
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
import {ScrollView} from 'react-native-gesture-handler';

const StatisticsTemplate = (props) => {
  const graphicData = props.data;
  const graphicColor = [
    'tomato',
    'orange',
    'gold',
    'lightgreen',
    'cornflowerblue',
    'turquoise',
    'violet',
  ];

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  let category;

  const setInSelectCategoryByName = (name, pos) => {
    if (
      category &&
      category.some((data, index) => data === true && index === pos)
    ) {
      category = category.map((data, index) =>
        index === pos ? (data = false) : null,
      );
      return;
    }
    if (
      category &&
      category.some((data, index) => data === true && index != pos)
    ) {
      category = category.map((data) =>
        data === true ? (data = false) : null,
      );
      category = category.map((data, index) =>
        index === pos ? (data = true) : null,
      );
      return;
    }
    category = graphicData.map((data) => data.category === name);
  };

  return (
    <View>
      <View style={styles.chartContainer}>
        <Svg
          //viewBox={'0 0' + ' ' + windowWidth + ' ' + windowHeight}
          style={{width: windowWidth, height: 350}}
          preserveAspectRatio="none">
          <VictoryPie
            standalone={false}
            //animate={{easing: 'cubic'}}
            fixLabelOverlap={true}
            animate={{duration: 2000, easing: 'bounce'}}
            //animate={{easing: 'onEnd'}}
            // startAngle={90}
            // endAngle={450}
            // data={[
            //   {category: 'Others', amount: 200},
            //   {category: 'HouseHold', amount: 2000},
            // ]}
            data={graphicData}
            //data={graphicData}
            // width={250}
            // height={250}
            x="category"
            y="amount"
            colorScale={graphicColor}
            innerRadius={graphicData.length > 4 ? 30 : 40}
            labels={({datum}) => [
              `${datum.category}`,
              `${Math.round((datum.amount / props.total) * 100).toString()}%`,
            ]}
            //backgroundComponent={<Rect height={100} />}
            radius={({datum}) =>
              category && category[datum._x - 1]
                ? graphicData.length > 4
                  ? 90
                  : 110
                : graphicData.length > 4
                ? 80
                : 100
            }
            //radius={70}
            // domainPadding={50}
            width={windowWidth}
            height={350}
            style={{
              data: {
                stroke: 'white',
                strokeWidth: 1,
              },
              labels: {
                //padding: 15,
                fontSize: ({datum}) => (datum.category.length > 10 ? 7 : 10),
                fontFamily: 'OpenSans-Bold',
              },
              parent: {
                elevation: 15,
                border: '3px solid #ccc',
              },
            }}
            //labelRadius={({innerRadius}) => innerRadius + 5}
            labelPlacement={'vertical'}
            labelComponent={
              <VictoryTooltip
                active
                renderInPortal={false}
                labelPlacement="perpendicular"
                pointerLength={20}
                pointerWidth={0}
                flyoutPadding={7}
                flyoutPadding={{top: 5, bottom: 5, left: 10, right: 10}}
                flyoutStyle={{
                  stroke: ({datum}) => graphicColor[datum._x - 1],
                  strokeWidth: 1,
                  fill: ({datum}) => graphicColor[datum._x - 1],
                }}
                style={{
                  fill: 'white',
                  //fontSize: ({datum}) => (datum.category.length > 10 ? 7 : 10),
                  fontSize: 10,
                  touchAction: 'none',
                }}
                constrainToVisibleArea
                // labelComponent={
                //   <VictoryLabel
                //     verticalAnchor="end"
                //     backgroundPadding={8}
                //     borderRadius={10}
                //   />
                // }
              />
            }
            //labelPosition="endAngle"
            // startAngle={130}
            // endAngle={600}
            // padAngle={0}
            //
            labelRadius={graphicData.length > 4 ? 85 : 110}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: () => {
                    return [
                      {
                        target: 'data',
                        mutation: (props) => {
                          let categoryName = graphicData[props.index].category;
                          setInSelectCategoryByName(categoryName, props.index);
                        },
                      },
                    ];
                  },
                },
              },
            ]}
          />
        </Svg>
      </View>
      <View
        style={{
          borderBottomColor: '#E8E8E8',
          borderBottomWidth: 7,
          marginTop: 0,
        }}
      />
      <View style={{marginBottom: moderateScale(10)}}>
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
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StatisticsTemplate;
