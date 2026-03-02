import { User } from "./user";

export interface UserState {
  user: User | null;
  loading: boolean;
  fetchLoading: boolean;
  error: string | null;
}