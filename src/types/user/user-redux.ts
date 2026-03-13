

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user"; 
}
export interface UserState {
  user: User | null;
  loading: boolean;
  fetchLoading: boolean;
  error: string | null;
}