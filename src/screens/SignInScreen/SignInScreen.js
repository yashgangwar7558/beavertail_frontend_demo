import Logo from '../../../assets/logo/cactusAI.png';
import Background from '../../../assets/background1.jpg';
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <ImageBackground
        source={Background}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.root}>
          <Spinner visible={isLoading} />
          <Image source={Logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" />
          {error ? (
            <Text style={styles.errorText}>
              {error}
            </Text>
          ) : null}
          <CustomInput placeholder="Username" value={username} setValue={setUsername} autoCapitalize='none' />
          <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry autoCapitalize='none' />
          <CustomButton text="Login" onPress={() => login(username, password)} />
          {/* <CustomButton text="Forgot password?" type="TERTIARY" /> */}
          {/* <SocialSignInButtons /> */}
          <Text style={styles.registerText}>Don't have an account?</Text>
          <CustomButton text="Register" onPress={() => navigation.navigate('SignUp')} type="SECONDARY" />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    flex: 1,
  },
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  registerText: {
    color: 'white',
    marginBottom: 10,
  },
});

export default SignInScreen;

