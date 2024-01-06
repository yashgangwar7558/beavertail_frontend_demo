import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import SplashScreen from '../../screens/SplashScreen'
import HomeScreen from '../../screens/HomeScreen'
import SignInScreen from '../../screens/SignInScreen'
import SignUpScreen from '../../screens/SignUpScreen'
import MenuBuilder from '../../screens/MenuBuilder'
import MenuItems from '../../screens/MenuItems'
import InvoiceTable from '../../screens/InvoiceTable'
import PurchaseHistory from '../../screens/PurchaseHistory'
import FoodCostCalculator from '../../screens/FoodCostCalculator'
import MarginCalculator from '../../screens/MarginCalculator'
import LoadingScreen from '../../components/LoadingScreen';
import { AuthContext } from '../../context/AuthContext.js';

enableScreens();
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {splashLoading ? (
          <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : userInfo.token ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/> 
            <Stack.Screen name="MenuItems" component={MenuItems} options={{ headerShown: false }}/>  
            <Stack.Screen name="MenuBuilder" component={MenuBuilder} options={{ headerShown: false }}/>
            <Stack.Screen name="InvoiceTable" component={InvoiceTable} options={{ headerShown: false }}/>
            <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} options={{ headerShown: false }}/>
            <Stack.Screen name="FoodCostCalculator" component={FoodCostCalculator} options={{ headerShown: false }}/>
            <Stack.Screen name="MarginCalculator" component={MarginCalculator} options={{ headerShown: false }}/>
          </>
        ) : (
          <>
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;