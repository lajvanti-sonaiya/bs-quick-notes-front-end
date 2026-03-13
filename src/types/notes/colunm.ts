export interface Column {
  _id: string;
  name: string;
  order: number;
}

export interface ColumnState {
  columns: Column[];
  loading: boolean;
  createLoading: boolean;
  error: null;
}
