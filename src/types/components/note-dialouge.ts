import { Note } from "@/types/notes/note";

type NoteDialogType = "create" | "edit";


export interface DialogState {
  open: boolean;
  type: NoteDialogType;
  title: string;
  data: any; 
}

export interface NoteDialogProps {
  open: boolean;
  title: string;
  handleClose: () => void;
  type: NoteDialogType;
  data?: Note;
}
