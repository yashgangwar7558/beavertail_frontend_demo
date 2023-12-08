import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';


const NewPasswordScreen = () => {

    const [code, setCode]=useState('');
    const [newPassword, setNewPassword]=useState('');

    const onSubmitPressed =() => {
      console.warn("onSubmitPressed");
    };

    const onSignInPress = () => {
      console.warn('onSignInPress');
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Text style={styles.title}>Reset your password</Text>
            <CustomInput placeholder="Code" value={code} setValue={setCode}/>
            <CustomInput placeholder="Enter your new password" value={newPassword} setValue={setNewPassword}/>
            <CustomButton text="Submit" onPress={onSubmitPressed}/>
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
export default NewPasswordScreen;