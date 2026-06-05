import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AlbumScreen from "../screens/AlbumScreen";
import SearchScreen from "../screens/SearchScreen";
import TradeScreen from "../screens/TradeScreen";
import TradeDataScreen from "../screens/TradeDataScreen";
import NewTradeScreen from "../screens/NewTradeScreen";

const AuthStack = createNativeStackNavigator();
const AlbumStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const TradeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AlbumStackScreen() {
  return (
    <AlbumStack.Navigator screenOptions={{ headerShown: false }}>
      <AlbumStack.Screen name="AlbumHome" component={AlbumScreen} />
    </AlbumStack.Navigator>
  );
}

function SearchStackScreen() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchHome" component={SearchScreen} />
      <SearchStack.Screen name="NewTrade" component={NewTradeScreen} />
    </SearchStack.Navigator>
  );
}

function TradeStackScreen() {
  return (
    <TradeStack.Navigator screenOptions={{ headerShown: false }}>
      <TradeStack.Screen name="TradeHome" component={TradeScreen} />
      <TradeStack.Screen name="TradeData" component={TradeDataScreen} />
    </TradeStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { paddingBottom: 4 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === "Album") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else {
            iconName = focused ? "swap-horizontal" : "swap-horizontal-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Album" component={AlbumStackScreen} />
      <Tab.Screen name="Search" component={SearchStackScreen} />
      <Tab.Screen name="Trades" component={TradeStackScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <AuthStack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </AuthStack.Navigator>
  );
}
