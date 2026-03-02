export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  createdAt: string;
  order: number;
}
export interface NoteDialogProps {
  open: boolean;
  type: "create" | "edit";
  title: string;
  data: Note | null;
  handleClose: () => void;
}
