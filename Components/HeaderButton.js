import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';

const customHeaderButton = props => {
    return (
        <HeaderButton
            {...props}
            IconComponent={MaterialIcons}
            iconSize={22}
            color={Platform.OS === 'android' ? Colors.accentColor : Colors.primaryColor}
        />
    );
};

export default customHeaderButton;