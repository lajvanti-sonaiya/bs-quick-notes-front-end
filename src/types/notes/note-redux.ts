import { store } from "@/redux/store";
import { Note } from "./note";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface NoteState {
  notes: Note[];
  total: number;
  loading: boolean;
  fetchLoading:boolean,
  error:any
}

export interface FetchNotesPayload {
  category: string;
  search: string;
  page: number;
  limit: number;
}

export interface UpdateNotePayload {
  id: string;
  data: Partial<Pick<Note, "title" | "content" | "category" | "isPinned" |"order" |"image">>;
}
