import {  Dimensions, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Swiper  from 'react-native-deck-swiper';
import axios from 'axios';
import { createRef, useEffect, useRef, useState } from 'react';
import { Avatar } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store';
import { getProfile } from '../shared/reducers/profile';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [cards, setCards] = useState([] as any);
  const [show, setShow] = useState(false);
  const [swiper, setSwiper]= useState() as any;
  const activePet:any = useAppSelector(state=>state.profile.activePet);
  const dispatch =useAppDispatch();
  useEffect(()=>{
    dispatch(getProfile())
  },[])
  useEffect(()=>{
    if(!show){
      getCards();
    }
  },[show])

  const like = (i:number,c:any)=>{
    if(!cards[i]?.id){
      alert('No active pet')
      return
    }
    axios.post('http://192.168.0.104:8080/api/v1/actions/like?id='+cards[i].id).then(res=>{
      if(res?.data?.actor?.id != activePet?.id){
        alert('its a match with ' + res?.data?.actor?.name )
      }
    })
  }

  const dislike = (i:number,c:any)=>{
    if(!activePet || !cards[i]?.id){
      alert('No active pet')
      return
    }
    axios.post('http://192.168.0.104:8080/api/v1/actions/dislike?id='+cards[i].id).then(res=>{
    
    })
  }
  

  const getCards = () => {
    axios.get('http://192.168.0.104:8080/api/v1/pets/search?distance=100').then(res=>{
      setCards(res.data)
      setShow(true)
    })
  }
  return (
    <View style={styles.container}>
     
        <View>
        {
          (show&&cards?.length) ? 
          (<Swiper
            overlayLabels={{left: {
              title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30
                  }
                }
              },
              right: {
              title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30
                  }
                }
              }}}
            ref={swiper => {
              setSwiper(swiper)
            }}
              disableTopSwipe={true}
              cards={cards}
              renderCard={(card:any) => {
                  return (
                      <View style={styles.card}>
                             {
                                !card?.avatars || !card?.avatars[0] ? 
                                <Avatar shape='square' style={styles.profileImageContainer} size='giant' source={require('../assets/images/avatar.png')} /> :
                                <Avatar  shape='square' style={styles.profileImageContainer} size='giant' source={{uri:`http://192.168.0.104:8080/images/${card?.avatars[0].path}`}} /> 
                              }
                          <View>
                           { card?.name && <Text  style={styles.cTitle}> {card?.name}</Text>}
                          </View>
                          <View >
                          {card?.breed && <Text style={styles.cBreed}>{card?.breed}</Text>}
                          </View>
                      </View>
                  )
              }}

              onSwipedLeft={(i:number)=>dislike(i,cards)}
              onSwipedRight={(i:number)=>like(i,cards)}
              onSwipedAll={() => {setShow(false)}}
              cardIndex={0}
              backgroundColor={'#fff'}
              stackSize= {3}
              marginTop={0}
              cardVerticalMargin={10}
              cardHorizontalMargin={10}
              cardStyle={styles.c}
              stackSeparation={20}
              >
          </Swiper>) :
          null
        }
        </View>
       { (show&&cards?.length) ? <View style={styles.actions}>
          <View style={styles.actionItem}>
            <Pressable onPress={()=>{
              if( swiper){
                swiper.swipeLeft()
              }
            }}>
                <Ionicons name='close' size={40} color='grey' />
            </Pressable>
          </View>
          <View style={styles.actionItem}>
            <Pressable onPress={()=>{
              if( swiper){
                swiper.swipeRight()
              }
            }}>
                <Ionicons name='heart' size={40} color='grey' />
            </Pressable>
          </View>
          </View> : 
          <View style={styles.noCards}>
            <Text>
              No pets found please adjust filters and try again
            </Text>
          </View>
          }
          
       
   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor:'#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  }, card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "flex-start",
    backgroundColor: "white"
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  },c:{
   
    margin:0,padding:0,height: Dimensions.get('window').height - 220,
  },
  profileImageContainer:{
    height: Dimensions.get('window').height - 300,
    width: Dimensions.get('window').width - 25,
    
  },
  cTitle:{
    padding:10,
    fontSize:18,
    fontWeight:'bold',
    paddingBottom:0
  }
  ,
  cBreed:{
    padding:15,
    fontSize:16,
    paddingTop:0
  },actions:{
    position:'absolute',
    bottom:10,
    height:70,
    width: Dimensions.get('window').width ,
    justifyContent:'space-evenly',
    alignItems:'center',
    flexDirection:'row',
  },
  actionItem:{
    backgroundColor:'white',
    borderRadius:300,
    elevation:2,
    height:70,
    width:70,
    justifyContent:'center',
    alignItems:'center',
  },noCards:{
    width: Dimensions.get('window').width ,
    height: Dimensions.get('window').height ,
    justifyContent:'center',
    alignItems:'center'


  }
});
