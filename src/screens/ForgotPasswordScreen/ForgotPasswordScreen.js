import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';


const ForgotPasswordScreen = () => {

    const[username, setUsername]=useState('');

    const onSendPressed =() => {
      console.warn("onSendPressed");
    };

    const onSignInPress = () => {
      console.warn('onSignInPress');
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Reset your password</Text>
            <CustomInput placeholder="Username" value={username} setValue={setUsername}/>
            <CustomButton text="Send" onPress={onSendPressed}/>
            <CustomButton text="Back to Sign In" onPress={onSignInPress} type="TERTIARY"/>
        </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
  root:{
    alignItems: 'center',
    padding:20,
  },
  title:{
    fontSize:24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text:{
    color:'gray',
    marginVertical:10,
  },
  link:{
    color: '#FDB075',
  }
});
export default ForgotPasswordScreen;