import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/userSlice"
import gistsReducer from './slices/gistsSlice'
import myGistsReducer from './slices/myGistsSlice'

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