import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/AntDesign';

import { Text } from '../components/Themed';
import { Avatar, Button, Divider } from '@ui-kitten/components';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { saveAvatar, saveProfile } from '../shared/reducers/profile';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen(props:any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  
  const dispatch = useAppDispatch();
  const profile:any = useAppSelector(state => state.profile);

  useEffect(()=>{
    if(profile){
      if(profile?.firstName){
        setFirstName(profile.firstName)
      }
      if(profile?.lastName){
        setLastName(profile.lastName)
      }
      if(profile?.address){
        setCity(profile.address)
      }
      if(profile?.email){
        setEmail(profile.email)
      }
      if(profile?.phone){
        setPhone(profile.phone)
      }
    }
  },[profile])
  useLayoutEffect(() => {
   
    props.navigation.setOptions({
      headerRight: () =>{
        if(firstName&&email&&city){
          return <Pressable onPress={()=>{
            if(!profile?.profileComplete){
              dispatch(saveProfile({firstName,lastName,email,phone,address:city}))
            }else{
              dispatch(saveProfile({firstName,lastName,email,phone,address:city}))
              props.navigation.navigate('Pet Profile')
            }
        }}><Text>Done</Text></Pressable>
        }
      } 
      
    });
  }, [props.navigation, firstName,lastName,email,phone,city]);
  
  const chooseFile= async ()=>{
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    try{

      let pickerResult:any =  await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Images,allowsMultipleSelection:false,base64:true});
     let name
     if(Platform.OS=='android'){
        name = `avatar.${pickerResult.uri.split('.').pop()}`;
     }else{
       name = `avatar.${pickerResult.uri.split('data:image/')[1].split(';')[0]}`;
     }
     const fd:any = {fileContentBase64:pickerResult.base64,fileName:name}
     dispatch(saveAvatar(fd))
    }catch(e){
      alert(e)
    }
  }
  return (

    <View style={styles.container}>
      <ScrollView>
        <>
          <View style={styles.center}>
            <View style={styles.avatarContainer}>
              {
                !profile?.avatar ? 
                <Avatar style={styles.profileImageContainer} size='giant' source={require('../assets/images/avatar.png')} /> :
                <Avatar style={styles.profileImageContainer} size='giant' source={{uri:`http://192.168.0.102:8080/images/${profile?.avatar?.path}`}} /> 
              }
              <Pressable onPress={chooseFile} style={styles.editIconContainer}>
                <Ionicons name='plus' size={17} color='#dfdbdb' />
              </Pressable>
            </View>
          </View>
        </>
        <>
          <Divider />

          <View style={styles.formRow}>
            <Text style={styles.label}>First Name</Text>
            <TextInput value={firstName} onChangeText={setFirstName} placeholderTextColor={'#000'} placeholder='Enter first name' style={styles.input}></TextInput>
          </View>
          <Divider />

          <View style={styles.formRow}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput value={lastName} onChangeText={setLastName} placeholderTextColor={'#000'} placeholder='Enter last name' style={styles.input}></TextInput>
          </View>
          <Divider />

          <View style={styles.formRow}>
            <Text style={styles.label}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} keyboardType='email-address' placeholderTextColor={'#000'} placeholder='Enter email address' style={styles.input}></TextInput>
          </View>
          <Divider />

          <View style={styles.formRow}>
            <Text style={styles.label}>Phone</Text>
            <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={'#000'} placeholder='Enter phone number' style={styles.input}></TextInput>
          </View>
          <Divider />

          <View style={styles.formRow}>
            <Text style={styles.label}>City</Text>
            <TextInput value={city} onChangeText={setCity} placeholderTextColor={'#000'} placeholder='Enter city' style={styles.input}></TextInput>
          </View>
        </>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 145,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  }, profileImageContainer: {
    margin: 20,
    padding: 10,
    elevation: 5,
    width: 100,
    height: 100,
    backgroundColor: '#dfdbdb',
    borderRadius: 300,
  }, editIconContainer: {
    elevation: 6,
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 300,
    position: 'absolute',
    bottom: 30,
    right: 25,
    padding: 1.5
  },
  formRow: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderTopColor: '#dfdbdb',
    borderTopWidth: 0,
    width: Dimensions.get('window').width
  },
  input: {
    borderColor: '#dfdbdb',
    height: 50
  },
  label: { opacity: 0.5, fontWeight: 'bold', },

});
