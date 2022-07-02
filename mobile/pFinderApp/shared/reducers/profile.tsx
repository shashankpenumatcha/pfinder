import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


export const initialState = {
  loading: false,
  firstName: null,
  lastName: null,
  email: null,
  phone: null,
  avatar: null,
  address: null,
  location: null,
  activePet: null,
  profileComplete:false,
  coords:null
};

export type ProfileState = Readonly<typeof initialState>;

export const getProfile = createAsyncThunk('authentication/get_profile', async () => axios.get<any>('http://192.168.0.102:8080/api/v1/profile'));
export const saveProfile = createAsyncThunk('authentication/save_profile', async (profile:any) => axios.put<any>('http://192.168.0.102:8080/api/v1/profile',profile));
export const saveAvatar = createAsyncThunk('authentication/save_avatar', async (profile:any) => axios.post<any>('http://192.168.0.102:8080/api/v1/profile/avatar',profile));
export const getCoords = createAsyncThunk('authentication/get_coords', async () => axios.get<any>('http://192.168.0.102:8080/api/v1/profile/location'));


export const ProfileSlice = createSlice({
  name: 'profile',
  initialState: initialState as ProfileState,
  reducers: {
  },
  extraReducers(builder:any) {
    builder
      .addCase(getProfile.pending, (state:any) => {
        state.loading = true;
      }).addCase(getProfile.rejected, (state:any) => ({
        ...state,
        loading:false,
        profileComplete:false
      }))
      .addCase(getProfile.fulfilled, (state:any, action:any) => {
        const profileComplete = action?.payload?.data?.email && action?.payload?.data?.firstName  && action?.payload?.data?.address
        return {
          ...state,
          loading:false,
          ...action?.payload?.data,
          profileComplete
        };
      }).addCase(saveProfile.pending, (state:any) => {
        state.loading = true;
      }).addCase(saveProfile.rejected, (state:any) => ({
        ...state,
        loading:false,
      }))
      .addCase(saveProfile.fulfilled, (state:any, action:any) => {
        const profileComplete = action?.payload?.data?.email && action?.payload?.data?.firstName  && action?.payload?.data?.address
        return {
          ...state,
          loading:false,
          ...action?.payload?.data,
          profileComplete,
          avatar:action?.payload?.data.activeAvatar
        };
      }).addCase(saveAvatar.pending, (state:any) => {
        state.loading = true;
      }).addCase(saveAvatar.rejected, (state:any) => {
        state.loading = false;
      })
      .addCase(saveAvatar.fulfilled, (state:any, action:any) => {
          if(action?.payload?.data){
            state.avatar = action?.payload?.data;
          }
      }).addCase(getCoords.pending, (state:any) => {
        state.loading = true;
      }).addCase(getCoords.rejected, (state:any) => {
        state.loading = false;
        state.coords = null
      })
      .addCase(getCoords.fulfilled, (state:any, action:any) => {
          if(action?.payload?.data){
            state.coords = action?.payload?.data;
          }
      })
  },
});

export const {} = ProfileSlice.actions;
export default ProfileSlice.reducer;
