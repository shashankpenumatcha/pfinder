import { Dimensions, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/AntDesign';

import { Text } from '../components/Themed';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
          <>
          <View style={styles.center}>
            <View style={styles.avatarContainer}>
              <View style={styles.profileImageContainer}>
              </View>
              <View style={styles.editIconContainer}>
              <Ionicons name='plus' size={17} color='#dfdbdb' />
              </View>
            </View>
          </View>
          </>
          <>
            <View style={styles.formRow}>
                <Text style={styles.label}>First Name</Text>
                <TextInput placeholderTextColor={'#000'} placeholder='Enter first name' style={styles.input}></TextInput>
            </View>
            <View style={styles.formRow}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput placeholderTextColor={'#000'} placeholder='Enter last name' style={styles.input}></TextInput>
            </View>
            <View style={styles.formRow}>
                <Text style={styles.label}>Email</Text>
                <TextInput keyboardType='email-address' placeholderTextColor={'#000'} placeholder='Enter email address' style={styles.input}></TextInput>
            </View>
            <View style={styles.formRow}>
                <Text style={styles.label}>Phone</Text>
                <TextInput keyboardType="phone-pad" placeholderTextColor={'#000'} placeholder='Enter phone number' style={styles.input}></TextInput>
            </View>
            <View style={styles.formRow}>
                <Text style={styles.label}>City</Text>
                <TextInput placeholderTextColor={'#000'} placeholder='Enter city' style={styles.input}></TextInput>
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
    backgroundColor:"#fff",
  },
  center:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  avatarContainer:{
    width:145,
    
  },
  label:{opacity:0.3,fontWeight: 'bold',},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },profileImageContainer:{
    margin:20,
    padding:10,
    elevation: 5,
    width: 100,
    height: 100,
    backgroundColor: '#dfdbdb',
    borderRadius:300,
  },editIconContainer:{
    elevation: 6,
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius:300,
    position:'absolute',
    bottom:30,
    right:25,
    padding:1.5
  },
  formRow:{
    paddingVertical:15,
    paddingHorizontal:50,
    borderTopColor:'#dfdbdb',
    borderTopWidth:1,
    width:Dimensions.get('window').width
  },
  input:{
    borderColor:'#dfdbdb',
    height:50
  }
});
