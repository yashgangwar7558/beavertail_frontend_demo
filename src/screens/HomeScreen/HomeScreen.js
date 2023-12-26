// HomeScreen.js
import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome';
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
        <Text style={styles.welcome}>Welcome, {userInfo.user.firstName} {userInfo.user.lastName}</Text>

        <Icon.Button style={styles.blueBtn}
          name="list"
          onPress={() => navigation.navigate('MenuItems')}
          backgroundColor="transparent"
          iconStyle={{ fontSize: 26 }}
          color={"white"}>
          <Text style={{ color: 'white', fontSize: 19 }}>Recipe Book</Text>
        </Icon.Button>

        <Icon.Button style={styles.blueBtn}
          name="edit"
          onPress={() => navigation.navigate('MenuBuilder')}
          backgroundColor="transparent"
          iconStyle={{ fontSize: 26 }}
          color={"white"}>
          <Text style={{ color: 'white', fontSize: 19 }}>Add Recipe</Text>
        </Icon.Button>

        <Icon.Button style={styles.blueBtn}
          name="file-text-o"
          onPress={() => navigation.navigate('InvoiceTable')}
          backgroundColor="transparent"
          iconStyle={{ fontSize: 26 }}
          color={"white"}>
          <Text style={{ color: 'white', fontSize: 19 }}>Invoices List</Text>
        </Icon.Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
  },
  welcome: {
    fontSize: 30,
    marginBottom: 40,
  },
  blueBtn: {
    position: "relative",
    width: 170,
    height: 45,
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: "#2bb378",
    backgroundColor: "#0071cd",
    justifyContent: "center"
  }
});

export default HomeScreen;
