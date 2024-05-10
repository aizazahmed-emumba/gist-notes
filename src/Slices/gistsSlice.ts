import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import type { Gist } from '../types/Gist';
import { fetchGists } from './actions';
import { ApiGistResult } from '../types/ApiGistResult';

export const gistsSlice = createSlice({
  initialState: {
    totalPages: 0 as number,
    value: [] as Gist[],
    loading: false,
    error: null as string | null,
  },
  name: 'gists',
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
    builder.addCase(fetchGists.fulfilled, (state, action: PayloadAction<ApiGistResult | undefined>) => {
      state.value = action.payload?.value || [];
      state.totalPages = action.payload?.remainingPages || 0;
      state.loading = false;
      state.error = null;
    }),
      builder.addCase(fetchGists.rejected, (state, action: PayloadAction<unknown>) => {
        console.log(action.payload);
        state.error = (action.payload as Error).message;
        state.loading = false;
        toast.error('Failed to fetch gists');
      }),
      builder.addCase(fetchGists.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { addGists, removeGist } = gistsSlice.actions;

export default gistsSlice.reducer;
