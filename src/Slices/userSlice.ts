import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import type { GitHubUser } from '../types/User';
import { updateAuthToken } from '../api/GistAPI';

const user: GitHubUser | null =
  localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')!) : null;

const initialState = {
  user,
  loading: false as boolean,
  error: null as string | null,
};

export const userSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<GitHubUser>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<unknown>) => {
      toast.error('An error occured, please try again');
      console.error(action.payload);
      state.error = (action.payload as Error).message;
    },
    clearUser: (state) => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      updateAuthToken();
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setError, setLoading, setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
