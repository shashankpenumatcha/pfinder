import { Button, Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/AntDesign';

import { Text } from '../components/Themed';
import { Avatar, Divider } from '@ui-kitten/components';
import { Modal as ModalBack } from '@ui-kitten/components';

import { useEffect, useLayoutEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';

import { getPetsAndAvatars, setSelectedPet, setSelectedPetAvatars } from '../shared/reducers/pet';
import useActivePetAvatar from '../hooks/useActivePetAvatar';
import axios from 'axios';
import { getProfile } from '../shared/reducers/profile';

export default function PetProfileScreen(props: any) {

  const dispatch = useAppDispatch();
  const profile: any = useAppSelector(state => state.profile);
  const activePetAvatar: any = useActivePetAvatar();
  const [modalVisible, setModalVisible] = useState(false);
  const pets: any = useAppSelector(state => state.pet.pets);
  const avatars: any = useAppSelector(state => state.pet.avatars);
  let [petAvatars, setPetAvatars]: any = useState({});
  useLayoutEffect(() => {
  }, [props.navigation]);


  const chooseFile = async () => {
    props.navigation.navigate('Profile')
  }
  return (

    <View style={styles.container}>
      {
        <ModalBack visible={modalVisible} backdropStyle={styles.backdrop} onBackdropPress={() => setModalVisible(!modalVisible)}>
          <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }}>
            <View style={styles.modal}>
              <Text style={styles.header}>
                Switch Active Pet
              </Text>
              <View style={styles.topContainer}>
                <ScrollView>
                  {
                    pets?.map((p: any) => {
                      return <Pressable key={p.id} onPress={() => {
                        axios.put('http://192.168.0.104:8080/api/v1/profile/pet', p).then(r => {
                          dispatch(getProfile())
                        })
                      }}>
                        <View key={p.id} style={styles.petSelector}>
                          {
                            !petAvatars[p.id]?.path ?
                              <Avatar style={styles.profileImageContainer} source={require('../assets/images/avatar.png')} /> :
                              <Avatar style={styles.profileImageContainer} source={{ uri: `http://192.168.0.104:8080/images/${petAvatars[p.id]?.path}` }} />
                          }
                          <View>
                            <Text style={styles.petNameSmall}>{p.name}</Text>
                            <Text>{p.breed}</Text>
                          </View>
                          {profile?.activePet?.id === p.id && <Ionicons style={styles.end} name='checkcircle' size={30} color='#004EDB' />}
                        </View>
                        <Divider></Divider>
                      </Pressable>
                    })
                  }
                </ScrollView>
              </View>
              <View style={styles.buttonContainer}>
                <Pressable onPress={() => { setModalVisible(!modalVisible) }}>
                  <View style={styles.buttonX}>
                    <Text style={styles.white}>Done</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </Modal>
        </ModalBack>
      }
      <ScrollView>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View>
              {
                !profile?.avatar ?
                  <Avatar style={styles.profileImageContainer} source={require('../assets/images/avatar.png')} /> :
                  <Avatar style={styles.profileImageContainer} source={{ uri: `http://192.168.0.104:8080/images/${profile?.avatar?.path}` }} />
              }
              <Pressable onPress={chooseFile} style={styles.editIconContainer}>
                <Ionicons name='edit' size={13} color='#004EDB' />
              </Pressable>
            </View>
            <View>
              {profile?.firstName ? <Text style={styles.name}>{profile?.firstName}</Text> : null}
              {profile?.lastName ? <Text style={styles.name}>{profile?.lastName}</Text> : null}
              {profile?.address ? <Text >{profile?.address}</Text> : null}
            </View>
          </View>
          <View>
            <Pressable onPress={() => {
              dispatch(setSelectedPet(null))
              dispatch(setSelectedPetAvatars([]))
              props.navigation.navigate('Edit Pet')
            }} style={styles.button}>
              <Text style={styles.name}>Add Pet</Text>
            </Pressable>
          </View>
        </View>

        <Divider style={styles.fullWidth}></Divider>
        <View style={styles.flex}>
          {
            !activePetAvatar?.path ?
              <Avatar style={styles.petImageContainer} source={require('../assets/images/avatar.png')} /> :
              <Avatar style={styles.petImageContainer} source={{ uri: `http://192.168.0.104:8080/images/${activePetAvatar?.path}` }} />
          }
          <View>
            <Text style={styles.petName}>{profile?.activePet?.name}</Text>
            <Text style={styles.petBreed}>{profile?.activePet?.breed}</Text>

          </View>

        </View>
        {
          profile?.activePet &&
          <View style={styles.actions}>
            <View>
              <Pressable onPress={() => {
                const pa: any = {};
                avatars.map((a: any) => {
                  if (a?.pet?.id) {
                    pa[a?.pet?.id] = a
                  }
                })
                dispatch(getPetsAndAvatars())
                setPetAvatars(pa)
                setModalVisible(true);
              }}
                style={styles.action}>
                <Ionicons name='swap' size={30} color='#004EDB' />
              </Pressable>
              <Text style={[styles.centerText]}>Switch</Text>
            </View>
            <View>
              <Pressable onPress={() => {
                axios.get('http://192.168.0.104:8080/api/v1/pet/avatars?id=' + profile?.activePet.id).then(r => {
                  dispatch(setSelectedPetAvatars(r.data))
                  dispatch(setSelectedPet(profile?.activePet))
                  props.navigation.navigate('Edit Pet')
                })
              }} style={styles.actionCenter}>
                <Ionicons name='edit' size={30} color='#004EDB' />
              </Pressable>
              <Text style={[styles.centerText]}>Edit Pet</Text>
            </View>
            <View>
              <Pressable onPress={()=>{
                props.navigation.navigate('Settings')
              }} style={styles.action}>
                <Ionicons name='setting' size={30} color='#004EDB' />
              </Pressable>
              <Text style={[styles.centerText]}>Settings</Text>

            </View>
          </View>
        }
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#004EDB"
  },
  petName: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004EDB'
  },
  petBreed: {
    textAlign: 'center',
    fontSize: 18,
  },
  flex: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    paddingRight: 25

  }, rowLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: "#F4F7FB",
  },
  center: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  label: { opacity: 0.3, fontWeight: 'bold', },
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
    elevation: 1,
    width: 70,
    height: 70,
    backgroundColor: '#dfdbdb',
    borderRadius: 300,
  }, petImageContainer: {
    margin: 20,
    padding: 10,
   // elevation: 5,
    width: 200,
    height: 200,
    backgroundColor: '#dfdbdb',
    borderRadius: 300,
    marginTop: 50
  }, editIconContainer: {
    elevation: 6,
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 300,
    position: 'absolute',
    bottom: 30,
    right: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formRow: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderTopColor: '#dfdbdb',
    borderTopWidth: 0,
    width: Dimensions.get('window').width
  },
  input: {
    borderColor: '#dfdbdb',
    height: 50
  }, fullWidth: {
    width: Dimensions.get('window').width

  }, button: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 5
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 25,
  },
  action: {
    backgroundColor: '#F4F7FB',
    padding: 5,
    borderRadius: 100,
    marginHorizontal: 30,
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    elevation: 2,
  }, actionCenter: {
    backgroundColor: '#F4F7FB',
    padding: 5,
    borderRadius: 100,
    marginHorizontal: 10,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    elevation: 2,
    marginTop: 35
  },
  centerText: {
    textAlign: 'center'
  }, curve: {
    width: Dimensions.get('window').width,
    height: 100,
    borderTopWidth: 1,
    borderTopLeftWidth: 1,
    borderLeftWidth: 1,

    marginTop: 70,
    borderRadius: 500

  },
  modal: {
    height: Dimensions.get('window').height / 2,
    position: 'absolute',
    bottom: 0,
    backgroundColor: "#fff",
    width: Dimensions.get('window').width,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 6
  }, backdrop: {
    backgroundColor: "rgba(0,0,0,0.7)",
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'absolute',
    elevation: 5
  }, buttonContainer: {
    position: 'absolute',
    bottom: 0,
    height: (Dimensions.get('window').height / 2) * .2,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  }, topContainer: {
    position: 'absolute',
    bottom: 0,
    height: (Dimensions.get('window').height / 2) * .9,
    width: Dimensions.get('window').width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
    paddingBottom: (Dimensions.get('window').height / 2) * .2
  }, buttonX: {
    elevation: 2,
    width: Dimensions.get('window').width * .9,
    padding: 15,
    backgroundColor: '#0065ff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  }, white: {
    color: '#fff'

  }, blue: {
    color: '#004EDB'
  }, petSelector: {
    width: Dimensions.get('window').width,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center'
  },
  switchItem: {
    flexDirection: 'row'
  },
  end: {
    position: 'absolute',
    right: 50
  },
  petNameSmall: {
    fontWeight: 'bold',
    fontSize: 18
  }

});
