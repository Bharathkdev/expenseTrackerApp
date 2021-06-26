import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DeleteItemsComponent = props => {
    return (
        <View style={styles.container}>
            <View style={styles.leftIcon}>
                <Icon
                    name='arrow-back'
                    size={30}
                    color="black"
                    onPress={() => {
                        navData.navigation.navigate({
                            routeName: 'Statistics'
                        })
                    }}
                />
            </View>
            <Text style={styles.textStyle}>Edit</Text>
            <View style={styles.rightIcon}>
                <Icon
                    name='delete'
                    size={30}
                    color="black"
                    onPress={() => {
                        navData.navigation.navigate({
                            routeName: 'Statistics'
                        })
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    leftIcon: {
        marginLeft: 20
    },

    textStyle: {
        paddingLeft: 20,
        fontSize: 20
    },

    rightIcon: {
        marginLeft: 250
    }
});

export default DeleteItemsComponent;