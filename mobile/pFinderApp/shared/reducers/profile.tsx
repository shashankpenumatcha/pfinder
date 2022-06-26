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
  profileComplete:false
};

export type ProfileState = Readonly<typeof initialState>;


export const getProfile = createAsyncThunk('authentication/get_profile', async () => axios.get<any>('http://192.168.0.100:8080/api/v1/profile'));


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
        const profileComplete = action?.payload?.data?.email && action?.payload?.data?.firstName && action?.payload?.data?.lastName && action?.payload?.data?.address
        return {
          ...state,
          loading:false,
          ...action?.payload?.data,
          profileComplete
        };
      })
  },
});

export const {} = ProfileSlice.actions;
export default ProfileSlice.reducer;
