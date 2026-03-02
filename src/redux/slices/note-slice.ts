import { axiosInstance } from "@/services/axios-instance";
import {
  addNoteToState,
  deleteNoteFormState,
  updateNoteOrderFormState,
  updateNoteToState,
} from "@/utills/note-reducer-helpers";
import { Note } from "@/types/notes/note";
import {
  FetchNotesPayload,
  NoteState,
  UpdateNotePayload,
} from "@/types/notes/note-redux";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: NoteState = {
  notes: [],
  total: 0,
  fetchLoading: true,
  loading: false,
  error: null,
};

//frtch all
export const fetchNotes = createAsyncThunk<
  { notes: Note[]; total: number },
  FetchNotesPayload,
  { rejectValue: string }
>(
  "notes/fetchNotes",
  async (
    { category = "", search = "", page = 0, limit = 10 },
    { getState, rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.get("/notes", {
        params: {
          ...(category && { category }),
          ...(search && { search }),
          page,
          limit,
        },
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notes",
      );
    }
  },
);
// create note
export const createNote = createAsyncThunk<Note, Partial<Note>>(
  "notes/createNote",
  async (noteData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/notes", noteData);
      return res?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create note",
      );
    }
  },
);

// update note
export const updateNote = createAsyncThunk<Note, UpdateNotePayload>(
  "notes/updateNote",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/notes/${id}`, data);
      return res?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update note",
      );
    }
  },
);

// delete note
export const deleteNote = createAsyncThunk<Note, string, { rejectValue: Note }>(
  "notes/deleteNote",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/notes/${id}`);

      return res?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete note",
      );
    }
  },
);
export const updateNotesOrder = createAsyncThunk<void, { notes: Note[] }>(
  "notes/updateNotesOrder",
  async ({ notes }, { rejectWithValue }) => {
    try {
      await axiosInstance.patch("/notes/updateNotesOrder", { notes });
    } catch (error) {
      return rejectWithValue("Failed to reorder");
    }
  },
);

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    socketNoteCreated: (state, action: PayloadAction<Note>) => {
      addNoteToState(state, action.payload);
    },

    socketNoteUpdated: (state, action: PayloadAction<Note>) => {
      updateNoteToState(state, action.payload);
    },

    socketNoteDeleted: (state, action: PayloadAction<Note>) => {
      deleteNoteFormState(state, action.payload);
    },

    socketOrderUpdate: (state, action: PayloadAction<Note[]>) => {
      updateNoteOrderFormState(state, action.payload);
    },
  },

  extraReducers: (builder) => {
    //fetch note
    builder
      .addCase(fetchNotes.pending, (state, action) => {
        state.fetchLoading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload.notes;
        state.total = action.payload.total;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.error = action.payload;
      });

    //create note
    builder
      .addCase(createNote.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        ((state.loading = false),
          //   (state.notes = [action.payload.data, ...state.notes]);
          addNoteToState(state, action.payload));
      })
      .addCase(createNote.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload));
      })

      //update note
      .addCase(updateNote.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        updateNoteToState(state, action.payload);
      })
      .addCase(updateNote.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload));
      })

      //delete note
      .addCase(deleteNote.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        deleteNoteFormState(state, action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        ((state.loading = false), (state.error = action.payload));
      });
  },
});
export const { socketNoteCreated, socketNoteUpdated, socketNoteDeleted ,socketOrderUpdate } =
  noteSlice.actions;

export default noteSlice.reducer;
