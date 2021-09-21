import * as React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home';
import Portfolio from '../screens/Portfolio';
import Prices from '../screens/Prices';
import Transfer from '../screens/Transfer';
import Settings from '../screens/Settings';
import News from '../components/News';

export type RootStackParamList = {
  HomeScreen: undefined;
  News: undefined;
};

type NewsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'News'>;

type Props = {
  navigation: NewsScreenNavigationProp;
};

const HomeStackNavigator = createNativeStackNavigator<RootStackParamList>();

const HomeNavigator = () => {
  return (
    <HomeStackNavigator.Navigator
      screenOptions={({ navigation }: Props) => ({
        headerHideShadow: true,
        headerHideBackButton: true,
        headerTitleStyle: { fontWeight: '700' },
        headerLeft: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{ marginLeft: 3 }}>
              <Ionicons name="chevron-back-outline" size={21} />
            </TouchableOpacity>
          );
        },
      })}>
      <HomeStackNavigator.Screen
        name="HomeScreen"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <HomeStackNavigator.Screen name="News" component={News} />
    </HomeStackNavigator.Navigator>
  );
};

const TabBarNavigator = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <TabBarNavigator.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          backgroundColor: 'white',
          borderRadius: 15,
          height: 90,
        },
      }}>
      <TabBarNavigator.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../assets/icons/1x/home.png')}
                resizeMode="contain"
                style={{
                  width: 17,
                  height: 17,
                  tintColor: focused ? 'blue' : 'gray',
                }}
              />
              <Text style={{ color: focused ? 'blue' : 'gray', fontSize: 10 }}>
                Home
              </Text>
            </View>
          ),
        }}
      />

      <TabBarNavigator.Screen
        name="Portfolio"
        component={Portfolio}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../assets/icons/1x/portfolio.png')}
                resizeMode="contain"
                style={{
                  width: 17,
                  height: 17,
                  tintColor: focused ? 'blue' : 'gray',
                }}
              />
              <Text style={{ color: focused ? 'blue' : 'gray', fontSize: 10 }}>
                portfolio
              </Text>
            </View>
          ),
        }}
      />

      <TabBarNavigator.Screen
        name="Transfer"
        component={Transfer}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../assets/icons/1x/transfer.png')}
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                  tintColor: focused ? 'blue' : 'gray',
                }}
              />
            </View>
          ),
        }}
      />

      <TabBarNavigator.Screen
        name="Prices"
        component={Prices}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../assets/icons/1x/prices.png')}
                resizeMode="contain"
                style={{
                  width: 17,
                  height: 17,
                  tintColor: focused ? 'blue' : 'gray',
                }}
              />
              <Text style={{ color: focused ? 'blue' : 'gray', fontSize: 10 }}>
                Prices
              </Text>
            </View>
          ),
        }}
      />

      <TabBarNavigator.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../assets/icons/1x/settings.png')}
                resizeMode="contain"
                style={{
                  width: 17,
                  height: 17,
                  tintColor: focused ? 'blue' : 'gray',
                }}
              />
              <Text style={{ color: focused ? 'blue' : 'gray', fontSize: 10 }}>
                Settings
              </Text>
            </View>
          ),
        }}
      />
    </TabBarNavigator.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
