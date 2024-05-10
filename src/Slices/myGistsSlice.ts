import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import type { Gist } from '../types/Gist';
import { fetchMyGists, fetchStarredGists } from './actions';

export const myGistsSlice = createSlice({
  initialState: {
    value: [] as Gist[],
    loading: false,
    error: null as string | null,
  },
  name: 'myGists',
  reducers: {
    addGists: (state, action: PayloadAction<Gist[]>): void => {
      state.value = action.payload;
      state.loading = false;
      state.error = null;
    },
    removeGist: (state, action: PayloadAction<string>) => ({
        ...state,
        value: state.value.filter((gist) => gist.id !== action.payload),
      }),
  },
  extraReducers(builder) {
    builder.addCase(fetchMyGists.fulfilled, (state, action: PayloadAction<Gist[] | undefined>) => {
      state.value = action.payload || [];
      state.loading = false;
      state.error = null;
    }),
      builder.addCase(fetchMyGists.rejected, (state, action: PayloadAction<unknown>) => {
        state.error = (action.payload as Error).message;
        state.loading = false;
        toast.error('Failed to fetch gists');
      }),
      builder.addCase(fetchMyGists.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.value = [];
      }),
      builder.addCase(fetchStarredGists.fulfilled, (state, action: PayloadAction<Gist[] | undefined>) => {
        state.value = action.payload || [];
        state.loading = false;
        state.error = null;
      }),
      builder.addCase(fetchStarredGists.rejected, (state, action: PayloadAction<unknown>) => {
        state.error = (action.payload as Error).message;
        state.loading = false;
        toast.error('Failed to fetch gists');
      }),
      builder.addCase(fetchStarredGists.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.value = [];
      });
  },
});

export const { addGists, removeGist } = myGistsSlice.actions;

export default myGistsSlice.reducer;
