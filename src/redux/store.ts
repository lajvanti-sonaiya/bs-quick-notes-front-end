import { configureStore } from '@reduxjs/toolkit'
import  noteSlice  from './slices/note-slice'
import userSlice from "./slices/user-slice"  
import columnSlice from "./slices/column-slice"
import taskSlice from "./slices/task-slice"

export const store = configureStore({
  reducer: {
    note:noteSlice,
    user:userSlice,
    columns: columnSlice,
    tasks:taskSlice
  },
})