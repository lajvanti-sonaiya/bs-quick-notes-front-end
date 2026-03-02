import { Note } from "@/types/notes/note";
import { NoteState } from "@/types/notes/note-redux";

export const addNoteToState = (state: NoteState, notes: Note) => {
  const index = state?.notes?.findIndex((note) => note._id == notes._id);

  if (index === -1) {
    state.notes = [notes, ...state.notes];
    state.total += 1;
  }

  state.notes.sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return Number(b.isPinned) - Number(a.isPinned);
  });
};

export const updateNoteToState = (state:NoteState, notes:Note) => {
  const index = state.notes.findIndex((note) => note._id === notes._id);
  if (index !== -1) {
    state.notes[index] = notes;
  }

  state.notes.sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return new Date(b.createdAt) .getTime()- new Date(a.createdAt).getTime();
    }
    return Number(b.isPinned) - Number(a.isPinned);
  });
};

export const deleteNoteFormState = (state:NoteState, notes:Note) => {
  const initialLength = state.notes.length;

  state.notes = state?.notes?.filter((note) => note._id !== notes._id);
  // state.total -= 1;
  if (state.notes.length < initialLength) {
    state.total -= 1;
  }
};
