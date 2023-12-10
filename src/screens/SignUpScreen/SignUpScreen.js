import React, { useContext, useState } from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView
} from 'react-native';
import client from '../../config';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../../context/AuthContext.js';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [Confpassword, setConfPassword] = useState(null);
  const { isLoading, register, error } = useContext(AuthContext);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
      <Spinner visible={isLoading} />
        <Text style={styles.title}>Create an account</Text>
        <CustomInput placeholder="First Name" value={firstName} setValue={setFirstName} />
        <CustomInput placeholder="Last Name" value={lastName} setValue={setLastName} />
        <CustomInput placeholder="Username" value={username} setValue={setUsername} />
        <CustomInput placeholder="Email" value={email} setValue={setEmail} />
        <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry />
        <CustomInput placeholder="Confirm Password" value={Confpassword} setValue={setConfPassword} secureTextEntry />
        <CustomButton text="Register" onPress={() => {
          register(lastName, firstName, username, email, password, Confpassword, navigation);
        }} />
        <Text style={styles.text}>By registering, you confirm that you accept our {' '}<Text style={styles.link}>Terms of Use </Text>and {' '}<Text style={styles.link}>Privacy Policy.</Text></Text>
        <SocialSignInButtons />
        <CustomButton text="Have an account? Sign In" onPress={() => navigation.navigate('SignIn')} type="TERTIARY" />
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  }
});

export default SignUpScreen;