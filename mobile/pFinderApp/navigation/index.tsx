/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import LoginScreen from '../screens/LoginScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import setupAxiosInterceptors from '../shared/axios-interceptor';
import { getAccount } from '../shared/reducers/authentication';
import { useAppDispatch, useAppSelector } from '../store';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ProfileScreen from '../screens/ProfileScreen';
import { getProfile } from '../shared/reducers/profile';
import { Avatar } from '@ui-kitten/components';
import PetProfileScreen from '../screens/PetProfileScreen';
import EditPetScreen from '../screens/EditPetScreen';
import useActivePetAvatar from '../hooks/useActivePetAvatar';
import SettingsScreen from '../screens/SettingsScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  setupAxiosInterceptors(()=>null);
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
 const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(props:any) {

  const dispatch = useAppDispatch();
  
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const token = useAppSelector(state => state.authentication.accessToken);
  const profile = useAppSelector(state => state.profile);

  React.useEffect(() => {
    (async(SecureStore)=>{
      if(Platform.OS!=='web'){
        const existingToken = await SecureStore.getItemAsync('token');
        if(token && !existingToken){
          await SecureStore.setItemAsync('token', token);
        }
        dispatch(getAccount());
        dispatch(getProfile());
      }else{
        const existingToken = await localStorage.getItem('token');
        if(token && !existingToken){
          await localStorage.setItem('token', token);
        }
        dispatch(getAccount());
        dispatch(getProfile());
      }
    })(SecureStore);
  }, [token]);


  function getScreens(){
    if(!isAuthenticated){
      return <Stack.Screen name="Root" component={LoginScreen} options={{ headerShown: false }} /> 
    }
    if(!profile||!profile.profileComplete){
      return <Stack.Screen name="Root" options={{ headerShown: true, title:"Edit Profile" }} component={ProfileScreen} />
    }
    if(!profile?.activePet){
      return <Stack.Screen name="Root" options={{ headerShown: true, title:"Add Pet" }} component={EditPetScreen} />
    }
    if(!profile?.location){
      return <Stack.Screen name="Root" options={{ headerShown: true, title:"Settings" }} component={SettingsScreen} />
    }
    return  <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: true, title:"pFinder" }} />

  }

  return (
    <Stack.Navigator screenOptions={{headerTitleAlign:"center"}}>
      {
       getScreens()
      }
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
      {isAuthenticated && <Stack.Screen options={{ headerShown: true, title:"Edit Profile" }}  name="Profile" component={ProfileScreen} />}
      {isAuthenticated && <Stack.Screen name="Pet Profile" component={PetProfileScreen} />}
      {isAuthenticated && <Stack.Screen name="Edit Pet" options={{ headerShown: true, title:"Add/Edit Pet" }} component={EditPetScreen} />}
      {isAuthenticated && <Stack.Screen name="Settings" options={{ headerShown: true, title:"Settings" }} component={SettingsScreen} />}

      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator(props:any) {
  const colorScheme = useColorScheme();
  const profile:any = useAppSelector(state => state.profile);
  const activePetAvatar = useActivePetAvatar()
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () =>{
       return <Pressable onPress={()=>props.navigation.navigate('Pet Profile')}>
        {
          !activePetAvatar?.path ? 
          <Avatar size='medium' source={require('../assets/images/avatar.png')} /> :
          <Avatar size='medium' source={{uri:`http://192.168.0.103:8080/images/${activePetAvatar?.path}`}} /> 
        }
      </Pressable>
      } 
      
    });
  }, [props.navigation,activePetAvatar]);

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Tab One',
          headerShown:true,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          headerShown:false,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
