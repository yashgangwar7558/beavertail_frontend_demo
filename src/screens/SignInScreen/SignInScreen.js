import Logo from '../../../assets/logo/green.png';
import React, { useState, useContext } from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  View,
  StyleSheet,
  useWindowDimensions,
  ScrollView
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';


const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const { isLoading, login, error } = useContext(AuthContext);
  const { height } = useWindowDimensions();


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Spinner visible={isLoading} />
        {/* <Image source={Logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" /> */}
        {error ? (
          <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>
            {error}
          </Text>
        ) : null}
        <CustomInput placeholder="Username" value={username} setValue={setUsername} autoCapitalize='none' />
        <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry autoCapitalize='none' />
        <CustomButton text="Sign In" onPress={() => {
          login(username, password);
        }} />
        <CustomButton text="Forgot password?" type="TERTIARY" />
        <SocialSignInButtons />
        <CustomButton text="Don't have an account? Create one" onPress={() => navigation.navigate('SignUp')} type="TERTIARY" />
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;