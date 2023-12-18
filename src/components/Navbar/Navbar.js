import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext.js';
import { useNavigation } from '@react-navigation/native';

const Navbar = ({ heading }) => {
    const { logout } = useContext(AuthContext);
    const navigation = useNavigation();

    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Image source={require('../../../assets/logo/green.png')} style={styles.logo} />
            </TouchableOpacity>

            <Text style={styles.heading}>{heading}</Text>

            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#06bcee',
      width: '100%',
      position: 'absolute',
      zIndex: 1,
    },
    logo: {
      width: 40,
      height: 40,
      marginRight: 10,
    },
    heading: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    logoutButton: {
      backgroundColor: '#fff',
      padding: 5,
      borderRadius: 5,
    },
    logoutText: {
      color: '#06bcee',
      fontWeight: 'bold',
    },
  });

export default Navbar;

