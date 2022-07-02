import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
3

export const initialState = {
  pets:[],
  selectedPet:{pet:null,avatars:[]},
  addedPet:null,
  loading:false,
  avatars:[],
  activePetAvatar: null
};

export type PetState = Readonly<typeof initialState>;

export const getSelectedPetAvatars = createAsyncThunk('authentication/get_selected_pet_avatars', async (payload:any) => axios.get<any>('http://192.168.0.104:8080/api/v1/pet/avatars?id='+payload.id));
export const getPetsAndAvatars = createAsyncThunk('authentication/get_pets_and_avatars', async () => axios.get<any>('http://192.168.0.104:8080/api/v1/profile/pets'));

export const PetsSlice = createSlice({
  name: 'pet',
  initialState: initialState as PetState,
  reducers: {
    setSelectedPet(state,action){
      state.selectedPet.pet = action.payload
    },
    setSelectedPetAvatars(state,action){
      state.selectedPet.avatars = action.payload
    },setActivePetAvatar(state,action){
      state.activePetAvatar = action.payload

    }
  },
  extraReducers(builder:any) {
    builder
    .addCase(getSelectedPetAvatars.pending, (state:any) => {
      state.loading = true;
    })
    .addCase(getSelectedPetAvatars.rejected, (state:any) => {
      state.loading = false;
    })
    .addCase(getSelectedPetAvatars.fulfilled, (state:any, action:any) => {
        if(action?.payload?.data){
          state.selectedPet.avatars = action?.payload?.data;
        }
    })

    .addCase(getPetsAndAvatars.pending, (state:any) => {
      state.loading = true;
    })
    .addCase(getPetsAndAvatars.rejected, (state:any) => {
      state.loading = false;
    })
    .addCase(getPetsAndAvatars.fulfilled, (state:any, action:any) => {
        if(action?.payload?.data){
          state.pets= action?.payload?.data?.pets;
          state.avatars= action?.payload?.data.avatars;
        }
    })
  },
});

export const {setSelectedPet,setSelectedPetAvatars, setActivePetAvatar } = PetsSlice.actions;
export default PetsSlice.reducer;
