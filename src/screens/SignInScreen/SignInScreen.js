import React, {useState} from 'react';
import Logo from '../../../assets/logo/green.png';
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';


const SignInScreen = () => {
    const[username, setUsername]= useState('');
    const[password, setPassword]= useState('');
    const { height } = useWindowDimensions();
    const onSignInPressed=() => {
      console.warn("Sign In");
    };

    const onForgotPasswordPressed =() =>{
      console.warn('onForgotPasswordPressed');
    };
    
    const onSignUpPress = () => {
      console.warn('onSignUpPress');
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Image source={Logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" />
            <CustomInput placeholder="Username" value={username} setValue={setUsername}/>
            <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry/>
            <CustomButton text="Sign In" onPress={onSignInPressed}/>
            <CustomButton text="Forgot password?" onPress={onForgotPasswordPressed} type="TERTIARY"/>
            <SocialSignInButtons/>
            <CustomButton text="Don't have an account? Create one" onPress={onSignUpPress} type="TERTIARY"/>
        </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
  root:{
    alignItems: 'center',
    padding:20,
  },
  logo:{
    width: '70%',
    maxWidth:300,
    maxHeight: 200,
  },
});
export default SignInScreen;