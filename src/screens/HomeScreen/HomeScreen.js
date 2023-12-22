// HomeScreen.js
import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext.js'
import Navbar from '../../components/Navbar'

const HomeScreen = () => {
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  return (
    <View>
      <View>
        <Navbar heading="Home" />
      </View>
      <View style={styles.container}>
        <Spinner visible={isLoading} />
        <Text style={styles.welcome}>Welcome {userInfo.user.firstName} {userInfo.user.lastName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MenuItems')} style={styles.serviceButton}>
          <Text style={styles.serviceText}>Recipe Book</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MenuBuilder')} style={styles.serviceButton}>
          <Text style={styles.serviceText}>Create Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  welcome: {
    fontSize: 22,
    marginBottom: 8,
  },
  serviceButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    margin: 5,
  },
  serviceText: {
    color: '#06bcee',
    fontWeight: 'bold',
    fontSize: '18px'
  },
});

export default HomeScreen;
