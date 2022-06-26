import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';


export const initialState = {
  loading: false,
  isAuthenticated: false,
  account: {} as any,
  errorMessage: null as unknown as string, // Errors returned from server side
  redirectMessage: null as unknown as string,
  sessionHasBeenFetched: false,
  logoutUrl: null as unknown as string,
  refreshToken:  null as unknown as  string,
  accessToken:  null as unknown as  string,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Actions
;

export const getAccount = createAsyncThunk('authentication/get_account', async () => axios.get<any>('http://192.168.0.100:8080/api/account'));

export const logoutServer = createAsyncThunk('authentication/logout', async () => axios.post<any>('http://192.168.0.100:8080/api/logout', {}));

export const login = createAsyncThunk('authentication/login', async ({username,password}:any) => axios.post<any>('http://192.168.0.100:8080/api/authenticate',{username,password,rememberMe:true}));

export const tokenRefresh = createAsyncThunk('authentication/refresh', async (data) => axios.post<any>('http://192.168.0.100:8080/api/refreshToken',data));

export const logout: () => AppThunk = () => async dispatch => {
  await dispatch(logoutServer());
};

export const clearAuthentication = (messageKey: any) => (dispatch:any) => {
  dispatch(authError(messageKey));
  dispatch(clearAuth());
};


export const setToken = (token: any) => (dispatch:any) => {
  dispatch(storeToken(token));
};


export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: initialState as AuthenticationState,
  reducers: {
    authError(state, action) {
      return {
        ...state,
        redirectMessage: action.payload,
      };
    },
    clearAuth(state) {
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
      };
    },storeToken(state:any, action:any) {
      return {
        ...state,
        accessToken:action.payload
      };
    },
  },
  extraReducers(builder:any) {
    builder
      .addCase(getAccount.rejected, (state:any, action:any) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        errorMessage: action.error.message,
      }))
      .addCase(getAccount.fulfilled, (state:any, action:any) => {
        const isAuthenticated = action.payload && action.payload.data && action.payload.data.activated;
        return {
          ...state,
          isAuthenticated,
          loading: false,
          sessionHasBeenFetched: true,
          account: action.payload.data,
        };
      })
      .addCase(logoutServer.fulfilled, (state:any, action:any) => ({
        ...initialState,
        logoutUrl: action.payload.data.logoutUrl,
      }))
      .addCase(getAccount.pending, (state:any) => {
        state.loading = true;
      }).addCase(login.pending, (state:any) => {
        state.loading = true;
      }).addCase(login.rejected, (state:any, action:any) => ({
        ...state,
        refreshToken: null,
        accessToken: null,
      }))
      .addCase(login.fulfilled, (state:any, action:any) => {
        const t = action?.payload?.data?.id_token;
        return {
          ...state,
          accessToken: t
        };
      })
  },
});

export const { authError, clearAuth, storeToken } = AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
