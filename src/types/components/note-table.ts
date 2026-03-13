export type ColumnId =
  | "pin"
  | "title"
  | "content"
  | "category"
  | "created at"
  | "actions";

export interface TableColumn {
  id: ColumnId;
  label: string;
  align?: "left" | "center" | "right";
  minWidth?: number;
}