import { BudgetScreen, HomeScreen, ProfileScreen } from '../screens'; // Adjust the import path as necessary

import { Icon } from 'native-base';
// src/navigators/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Budget') {
            iconName = 'wallet';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} style={{ color, fontSize: size }} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
