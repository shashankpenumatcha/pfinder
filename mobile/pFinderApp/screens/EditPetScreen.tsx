  import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
  import { useEffect, useLayoutEffect, useState } from 'react';
  import { useAppDispatch, useAppSelector } from '../store';
  import { Ionicons } from '@expo/vector-icons';
  import * as ImagePicker from 'expo-image-picker';
  import axios from 'axios';
  import { getPetsAndAvatars, getSelectedPetAvatars, setSelectedPet, setSelectedPetAvatars } from '../shared/reducers/pet';
  import { getProfile } from '../shared/reducers/profile';
  import { Avatar, Datepicker, Select, SelectItem, IndexPath } from '@ui-kitten/components';

  export default function EditPetScreen(props:any) {
    const dispatch = useAppDispatch();
    const profile:any = useAppSelector(state => state.profile);
    const selectedPet:any = useAppSelector(state => state.pet.selectedPet.pet);
    const avatars:any = useAppSelector(state => state.pet.selectedPet.avatars);
    const [name, setName] = useState("");
    const  [dob, setDob] = useState("");
    const  [breed, setBreed] = useState("");
    const  [gender, setGender] = useState("");

    useLayoutEffect(() => {
      props.navigation.setOptions({
        headerRight: () =>{
          if(!selectedPet && (!name&&!dob&&!breed&&!gender)){
            return null
          }
          return (<Pressable onPress={()=>{
              if(!selectedPet){
                createPet().then(res=>{
                  setActivePetAPI(res.data.id).then(r=>{
                    dispatch(getProfile())
                    props.navigation.navigate('Pet Profile')
                  })
                })
              }else{
                if(!profile.activePet){
                  updatePet().then(res=>{
                    setActivePetAPI(selectedPet.id).then(r=>{
                      dispatch(getProfile())
                      props.navigation.navigate('Pet Profile')
                    })
                  })
                }else{
                  updatePet().then(res=>{
                    dispatch(getProfile())
                    props.navigation.navigate('Pet Profile')
                  })
                }
                
              }
          }}><Text>Done</Text></Pressable>)
        },
        title: selectedPet ?  'Edit Pet' : 'Add Pet'    
      });
    }, [props.navigation,selectedPet,avatars, name,breed,gender,dob]);


    useEffect(()=>{
      setName(selectedPet?.name)
      setDob(selectedPet?.dateOfBirth)
      setBreed(selectedPet?.breed)
      setGender(selectedPet?.gender)

    },[selectedPet])


    useEffect(()=>{
      dispatch(getPetsAndAvatars());
    },[avatars])



    const createPet = async () => {
        return axios.post('http://192.168.0.104:8080/api/v1/pet',{
          name,breed,gender,dateOfBirth:dob
        })
    }  

    const updatePet = async () => {
      return axios.put('http://192.168.0.104:8080/api/v1/pet',{
        name,breed,gender,dateOfBirth:dob,id:selectedPet?.id
      })
  }  
    const setActivePetAPI = async (id:number) => {
      return axios.put('http://192.168.0.104:8080/api/v1/profile/pet',{id})
  }


    const deleteAvatar = async (index:number) => {
      if(avatars?.length && avatars[index]){
        axios.delete('http://192.168.0.104:8080/api/v1/pet/avatar?id='+avatars[index].id).then(()=>{
          dispatch(getSelectedPetAvatars({id:selectedPet.id}))
        })
      }
    }
    
    const chooseFile= async (index:number)=>{
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
      try{
        let pickerResult:any =  await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Images,allowsMultipleSelection:false,base64:true});
        let name:any;
        if(Platform.OS=='android'){
            name = `avatar.${pickerResult.uri.split('.').pop()}`;
        }else{
          name = `avatar.${pickerResult.uri.split('data:image/')[1].split(';')[0]}`;
        }
        if(!selectedPet){
          createPet().then((res:any)=>{
            dispatch(setSelectedPet(res.data));
            dispatch(getProfile());
            axios.get('http://192.168.0.104:8080/api/v1/pet/avatars?id='+res.data.id).then(
              r=>{
                dispatch(setSelectedPetAvatars(r.data))
                savePetAvatar(name,r.data,index,res.data.id,pickerResult.base64)
              }
            )
          });
        }else{
          axios.get('http://192.168.0.104:8080/api/v1/pet/avatars?id='+selectedPet.id).then(
            r=>{
              dispatch(setSelectedPetAvatars(r.data))
              savePetAvatar(name,r.data,index,selectedPet?.id,pickerResult.base64)
            }
          )
        }      
      
      }catch(e){
        alert(e)
      }
    }

  const savePetAvatar = (name:any,avatars:any[],index:number,petId:number,base64:string)=>{
    const fd:any = {fileContentBase64:base64,fileName:name}
        axios.post('http://192.168.0.104:8080/api/v1/pet/avatar?id='+petId,fd).then(res=>{
          dispatch(getSelectedPetAvatars({id:petId}))
        })
    }

    return (
      <View style={styles.container}>
    
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.gallery}>
              {
                [0,1,2,3,4,5].map(i=>(
                  <View key={i} style={styles.imageContainer}>
                    {
                      avatars[i] ?
                      <Avatar style={styles.imageContainer} shape='square' source={{ uri: `http://192.168.0.104:8080/images/${avatars[i]?.path}` }} />:
                      <Ionicons name='image' size={60} color='#fff' />

                    }

                    {
                      avatars[i]?.path ? 
                      <Pressable onPress={()=>deleteAvatar(i)}  style={styles.closeIconContainer}> 
                        <Ionicons name='close' size={17} color='#fff' />
                      </Pressable> :   
                      <Pressable onPress={()=>chooseFile(i)}  style={styles.editIconContainer}> 
                        <Ionicons name='add-outline' size={17} color='#fff' />
                      </Pressable>
                    }
                    
                  </View>
                ))
              }
            </View>
            <View style={styles.profile}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Name</Text>
                <TextInput value={name} onChangeText={setName} placeholderTextColor={'#000'} placeholder='Enter pet name' style={styles.input}></TextInput>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Breed</Text>
                <TextInput value={breed} onChangeText={setBreed} placeholderTextColor={'#000'} placeholder='Enter breed' style={styles.input}></TextInput>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Gender</Text>
                <Select
                  placeholder={'Select Gender'}
                  value={gender?gender:''}
                  selectedIndex={gender==='Male' ? new IndexPath(0) : (gender==='Female'? new IndexPath(1) : null as any)}
                  onSelect={(index:any) =>{
                    if(index.row===0){
                      setGender('Male')
                    }else if(index.row===1){
                      setGender('Female')
                    }
                  }
                  
                  }>
                  <SelectItem style={styles.blank} title='Male'/>
                  <SelectItem title='Female'/>
                </Select>
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Select Date of Birth</Text>
                <Datepicker
                  controlStyle={styles.blank}
                  placeholder='Date of Birth'
                  date={dob ? new Date(dob) : new Date()}
                  max={new Date()}
                  onSelect={nextDate =>{setDob(nextDate.toISOString())}}
                />
              </View>
            </View>
          </ScrollView>
      </View>
    );
  }

  const styles = StyleSheet.create({
    blank:{
      borderWidth:0,
      backgroundColor:'white',
      paddingLeft:0,
      marginLeft:-5,
    },
    content:{
      justifyContent:'space-between',
      alignItems:'center',
      flexGrow:1
    },
    container:{
      flex:1,
      justifyContent:'flex-start',
      alignItems:'center',
      backgroundColor:'#fff',
    },gallery:{
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'flex-start',
      flexWrap:"wrap",
      paddingTop:25,
      paddingHorizontal:15,
      flexGrow:1
    },imageContainer:{
      height:160,
      marginVertical: 15,
      marginHorizontal:5,
      backgroundColor:'#e7f0ff',
      justifyContent:'center',
      alignItems:'center',
      width:Dimensions.get('window').width/4,
      elevation:1,
      borderRadius:4,
      color:'#fff'
    },profile:{
      flexGrow:1,
      marginTop:25,
      width: Dimensions.get('window').width,
      paddingHorizontal:25,
      backgroundColor:'#0065ff',
      borderTopRightRadius:25,
      borderTopLeftRadius:25,
      paddingTop:50,
      paddingBottom:50,
      elevation:10,
    
    },
    full:{
      width: Dimensions.get('window').width,
      marginTop:15
    },formRow: {
      paddingVertical: 15,
      paddingHorizontal: 25,
      borderTopColor: '#dfdbdb',
      borderTopWidth: 0,
      width: Dimensions.get('window').width
    },
    input: {
      borderColor: '#dfdbdb',
      height: 40
    },
    label: { color:'#b4b4b4', fontWeight: 'bold' },
    inputBox:{
      backgroundColor:'#fff',
      padding:5,
      borderRadius:4,
      marginVertical:7.5,

    },editIconContainer: {
      elevation: 6,
      width: 20,
      height: 20,
      borderRadius: 300,
      position: 'absolute',
      bottom: -5,
      right: -7,
      paddingLeft: 1.8,
      paddingTop: 1,

      backgroundColor:'#0065ff',

    },closeIconContainer: {
      elevation: 6,
      width: 20,
      height: 20,
      borderRadius: 300,
      position: 'absolute',
      bottom: -5,
      right: -7,
      paddingLeft: 1.8,
      paddingTop: 1,

      backgroundColor:'red',

    }
  });
