import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Gist } from '../types/Gist'
import toast from 'react-hot-toast';
import { fetchGists } from './actions';

export const gistsSlice = createSlice({
    initialState:{
        totalPages: 0 as  number,
        value : [] as Gist[],
        loading : false,
        error: null
    },
    name: 'gists',
    reducers: {
        addGists: (_, action: PayloadAction<any>) => action.payload,
        removeGist: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                value: state.value.filter(gist => gist.id !== action.payload)
            };
        }
        
    },
    extraReducers(builder) {
        builder.addCase(fetchGists.fulfilled, (state, action:PayloadAction<any>) => {
            state.value = action.payload.value
            state.totalPages = action.payload.remainingPages
            state.loading = false
            state.error = null
        }),
        builder.addCase(fetchGists.rejected, (state, action:PayloadAction<any>) => {
            console.log(action.payload)
            state.error = action.payload.message 
            state.loading = false
            toast.error("Failed to fetch gists")
        }),
        builder.addCase(fetchGists.pending, (state) => {
            state.loading = true
        })
    },
})

export const { addGists, removeGist } = gistsSlice.actions

export default gistsSlice.reducer