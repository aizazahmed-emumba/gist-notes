import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import gistsReducer from './slices/gistsSlice';
import myGistsReducer from './slices/myGistsSlice';

export const store = configureStore({
  reducer: {
    userState: userReducer,
    gists: gistsReducer,
    myGists: myGistsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
