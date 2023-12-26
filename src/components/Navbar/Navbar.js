import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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

      <Icon.Button
        style={styles.logoutBtn}
        onPress={logout}
        name="sign-out"
        backgroundColor="white"
        iconStyle={{ fontSize: 20, padding: 0, marginRight: 5 }}
        color={"#4697ce"}
      >
        <Text style={{ color: '#4697ce', fontSize: 15, fontWeight: '600' }}>Logout</Text>
      </Icon.Button>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4697ce',
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
});

export default Navbar;

