import { axiosInstance } from "@/services/axios-instance";
import { User } from "@/types/user/user";
import { UserState } from "@/types/user/user-redux";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  user: null,
  loading: false,
  fetchLoading: true,
  error: null,
};

export const syncUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "user/syncUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/users/sync");
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to sync user",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // sync user
    builder
      .addCase(syncUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(syncUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
