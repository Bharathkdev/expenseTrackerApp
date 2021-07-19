import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import BouncingPreloader from 'react-native-bouncing-preloaders';

const BouncingLoader = (props) => {
  return (
    <View style={styles.centerLoader}>
      <BouncingPreloader
        icons={[
          'https://image.flaticon.com/icons/png/128/73/73238.png',
          'https://image.flaticon.com/icons/png/512/153/153604.png',
          // 'https://image.flaticon.com/icons/png/512/17/17132.png',
          // 'https://img-premium.flaticon.com/png/512/442/premium/442615.png?token=exp=1624903043~hmac=38ac679885409b6756f348060701c68f',
        ]}
        // leftRotation="-680deg"
        // rightRotation="360deg"
        leftDistance={-100}
        rightDistance={-150}
        size={50}
        speed={2000}
      />
      <Text style={styles.loaderText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    marginTop: 50,
  },
});

export default BouncingLoader;
