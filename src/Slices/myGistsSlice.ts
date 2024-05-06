import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Gist } from '../Types/Gist'
import toast from 'react-hot-toast';
import { fetchMyGists } from './actions';

export const myGistsSlice = createSlice({
    initialState:{
        value : [] as Gist[],
        loading : false,
        error: null
    },
    name: 'myGists',
    reducers: {
        addGists: (_, action: PayloadAction<any>) => action.payload,
        removeGist: (state, action: PayloadAction<any>) => {
            state.value = state.value.filter(gist => gist.id !== action.payload.id)
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchMyGists.fulfilled, (state, action:PayloadAction<any>) => {
            state.value = action.payload
            state.loading = false
            state.error = null
        }),
        builder.addCase(fetchMyGists.rejected, (state, action:PayloadAction<any>) => {
            console.log(action.payload)
            state.error = action.payload.message 
            state.loading = false
            toast.error("Failed to fetch gists")
        }),
        builder.addCase(fetchMyGists.pending, (state) => {
            state.loading = true
        })
    },
})


export const { addGists, removeGist } = myGistsSlice.actions

export default myGistsSlice.reducer