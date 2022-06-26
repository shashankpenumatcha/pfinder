import React from 'react';
import { Button, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { login } from '../shared/reducers/authentication';
import { useAppDispatch } from '../store';

export default function LoginScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useAppDispatch();
  const loginfromWeb = ()=>{
    dispatch(login({username,password}));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>pFinder</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        keyboardType="visible-password"
        secureTextEntry={true}
      />
      <Pressable style={styles.button} onPress={loginfromWeb}>
        <Text style={{textAlign:"center",color:'#fff'}}>Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f67062',
    backgroundImage: "linear-gradient(315deg, #fc5296 0%, #f67062 74%)"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },input: {
    height: 50,
    margin: 12,
    width:300,
    borderWidth: 1,
    padding: 10,
    backgroundColor:"#fff",
    borderColor:"#fff",
    borderRadius:5
  },logo: {
    fontWeight:'bold',
    fontSize:38,
    color:'#fff',
    marginBottom:25
  },button: {
    borderColor:"#fff",
    color:"#fff",
    borderWidth:1,
    borderRadius:5,
    padding:10,
    width:150,
    textAlign:'center',
    marginTop:25
    
  }
  
});
