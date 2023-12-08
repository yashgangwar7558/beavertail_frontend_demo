import { StatusBar } from 'expo-status-bar';
import { SafeAreaView,StyleSheet, Text} from 'react-native';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ConfirmEmailScreen from './src/screens/ConfirmEmailScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import NewPasswordScreen from './src/screens/NewPasswordScreen';

const App =() => {
  return (
    <SafeAreaView style={styles.root}>
      <SignInScreen/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root:{
    flex:1,
    backgroundColor:'#f9fbfc',
  },
});
export default App;


