import {  Dimensions, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Swiper  from 'react-native-deck-swiper';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Avatar } from '@ui-kitten/components';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [cards, setCards] = useState([] as any);
  const [show, setShow] = useState(false);


  useEffect(()=>{
    if(!show){
      getCards();
    }
  },[show])


  const getCards = () => {
    axios.get('http://192.168.0.104:8080/api/v1/pets/search?distance=10').then(res=>{
      setCards(res.data)
      setShow(true)
    })
  }
  return (
    <View style={styles.container}>
        {
          show ? 
          (<Swiper
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
                           <Text  style={styles.cTitle}> {card.name}</Text>
                          </View>
                          <View >
                            <Text style={styles.cBreed}>{card.breed}</Text>
                          </View>
                      </View>
                  )
              }}

              onSwiped={(cardIndex) => {console.log(cardIndex)}}
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
    
  }
});
