import React from 'react';
import { StatusBar, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import Navigation from './src/components/Navigation/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import SignUpScreen from './src/screens/SignUpScreen'
import SplashScreen from './src/screens/SplashScreen'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <AuthProvider>
        <StatusBar backgroundColor="#06bcee" />
        <Navigation />
      </AuthProvider>
    </SafeAreaView>
  );
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


