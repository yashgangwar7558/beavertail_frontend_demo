import React, { useContext, useState } from 'react';
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
import Logo from '../../../assets/logo/cactusAI.png';
import Background from '../../../assets/background1.jpg';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [Confpassword, setConfPassword] = useState(null);
  const { isLoading, register, error } = useContext(AuthContext);
  const { height } = useWindowDimensions();

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <ImageBackground source={Background} style={styles.backgroundImage}>
        <View style={styles.root}>
          <Spinner visible={isLoading} />
          <Image source={Logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" />
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          <CustomInput placeholder="First Name" value={firstName} setValue={setFirstName} autoCapitalize='none' />
          <CustomInput placeholder="Last Name" value={lastName} setValue={setLastName} autoCapitalize='none' />
          <CustomInput placeholder="Username" value={username} setValue={setUsername} autoCapitalize='none' />
          <CustomInput placeholder="Email" value={email} setValue={setEmail} autoCapitalize='none' />
          <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry autoCapitalize='none' />
          <CustomInput placeholder="Confirm Password" value={Confpassword} setValue={setConfPassword} secureTextEntry autoCapitalize='none' />
          <Text style={styles.text}>
            By registering, you confirm that you accept our{' '}
            <Text style={styles.link}>Terms of Use </Text>and{' '}
            <Text style={styles.link}>Privacy Policy.</Text>
          </Text>
          <CustomButton text="Register" onPress={() => register(lastName, firstName, username, email, password, Confpassword, navigation)} />
          <Text>Already have an account?</Text>
          <CustomButton text="Login" onPress={() => navigation.navigate('SignIn')} type="SECONDARY" />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
  text: {
    color: 'gray',
    marginVertical: 10,
    width: '85%',
    textAlign: 'center',
  },
  link: {
    color: '#FDB075',
  },
});

export default SignUpScreen;
