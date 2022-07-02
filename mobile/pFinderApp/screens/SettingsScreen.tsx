
import { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import { View } from '../components/Themed';
import { useAppDispatch, useAppSelector } from '../store';
import axios from 'axios';
import { getCoords } from '../shared/reducers/profile';
import MapView, {Marker} from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Divider, Menu, MenuGroup, MenuItem } from '@ui-kitten/components';

export default function SettingsScreen(props:any) {
  const [errorMsg, setErrorMsg] = useState('');
  const coords:any = useAppSelector(state => state.profile.coords);
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () =>{
        if(!coords){
          return null
        }
        return (<Pressable onPress={()=>{
          props.navigation.navigate('Root')
        }}><Text>Done</Text></Pressable>)
      },
      title: 'Settings'   
    });
  }, [props.navigation]);


  useEffect(() => {
    if(!coords || !coords.length){
      retreiveLocation();
    }
  }, [coords]);

  useEffect(() => {
      retreiveLocation();
    
  }, []);

  const retreiveLocation = ()=>{
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      if(!location){
        return
      }
      axios.put('http://192.168.0.104:8080/api/v1/profile/location',{lat:location.coords.latitude, lng:location.coords.longitude}).then(()=>{
        dispatch(getCoords());
      })
    })();
  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } 

  return (
    <View style={styles.container}>
      <Text style={styles.h}>Update Location</Text>
      <View>
        {
          coords ? 
          <MapView
              region={{
                latitude: coords[0],
                longitude: coords[1],
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={styles.map}>
          <Marker coordinate={{latitude:coords[0],longitude:coords[1]} as any}/>
          </MapView>:
          <MapView style={styles.map}/>
        }
        <View style={styles.locate} >
          <Pressable onPress={()=>retreiveLocation()}>
            <Ionicons name='locate' size={30} color='#fff' />
          </Pressable>
        </View>
      </View>
      <Text style={styles.footer}>Please provide location to start matching</Text>

      <Divider style={styles.divider}></Divider>

      <Text style={styles.h}>Update Distance</Text>

  </View>
  );
}

const styles = StyleSheet.create({
  divider:{
    width: Dimensions.get('window').width,
    marginVertical:15
  },
  footer:{
  alignSelf:'flex-start',
  paddingLeft:15,
  paddingVertical:5
  },
  h:{
    alignSelf:'flex-start',
    padding:13,
    fontWeight:'bold',
    fontSize:18
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },map: {
    width: Dimensions.get('window').width,
    height: 200,
  },locate:{
    position:'absolute',
    top:10,
    right:10,
    borderRadius:200,
    backgroundColor:'#004EDB',
    width:35,
    height:35,
    justifyContent:'center',
    alignItems:'center',
    elevation:6
  }
});
