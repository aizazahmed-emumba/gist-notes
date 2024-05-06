import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./Slices/userSlice"
import gistsReducer from './Slices/gistsSlice'
import myGistsReducer from './Slices/myGistsSlice'

export const store = configureStore({
  reducer: {
    userState : userReducer,
    gists : gistsReducer,
    myGists : myGistsReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch