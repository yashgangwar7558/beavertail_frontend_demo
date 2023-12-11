import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ value, setValue, placeholder, secureTextEntry, autoCapitalize }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.focusedContainer]}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={[styles.input, isFocused && styles.focusedInput]}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#A0A0A0"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    width: '90%',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  focusedContainer: {
    borderColor: '#3B71F3', // Highlight color when focused
  },
  input: {
    fontSize: 16,
    color: '#333333',
    height: 40,
  },
  focusedInput: {
    color: '#333333', // Text color when focused
  },
});

export default CustomInput;

