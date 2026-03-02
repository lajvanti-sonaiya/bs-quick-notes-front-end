import { configureStore } from '@reduxjs/toolkit'
import  noteSlice  from './slices/note-slice'
 import userSlice from "./slices/user-slice"  



export const store = configureStore({
  reducer: {
    note:noteSlice ,
    user:userSlice
  },
})