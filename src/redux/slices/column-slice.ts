"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios-instance";
import { Column, ColumnState } from "@/types/notes/colunm";

// GET ALL COLUMNS
export const fetchColumns = createAsyncThunk("columns/fetch", async () => {
  const res = await axiosInstance.get("/colunms");
  return res.data.data;
});

// CREATE COLUMN
export const createColumn = createAsyncThunk(
  "columns/create",
  async (name: string) => {
    const res = await axiosInstance.post("/colunms/create", { name });
    return res.data.data;
  },
);

// UPDATE COLUMN NAME
export const updateColumn = createAsyncThunk(
  "columns/update",
  async ({ id, name }: { id: string; name: string }) => {
    const res = await axiosInstance.put(`/colunms/${id}`, { name });
    return res.data.data;
  },
);

// DELETE COLUMN
export const deleteColumn = createAsyncThunk(
  "columns/delete",
  async (id: string) => {
    await axiosInstance.delete(`/colunms/${id}`);
    return id;
  },
);

// REORDER COLUMNS
export const reorderColumns = createAsyncThunk(
  "columns/reorder",
  async (columns: Column[]) => {
    const res = await axiosInstance.put("/colunms/reorder", { columns });
    return res.data.data;
  },
);

export const initialState: ColumnState = {
  columns: [],
  loading: false,
  createLoading: false,
  error: null,
};

const columnSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchColumns.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchColumns.fulfilled, (state, action) => {
      state.loading = false;
      state.columns = action.payload;
    });

    builder.addCase(fetchColumns.rejected, (state) => {
      state.loading = false;
    });

    // CREATE
    builder.addCase(createColumn.pending, (state) => {
      state.createLoading = true;
    });

    builder.addCase(createColumn.fulfilled, (state, action) => {
      state.createLoading = false;
      state.columns.push(action.payload);
    });

    builder.addCase(createColumn.rejected, (state) => {
      state.createLoading = false;
    });

    // UPDATE
    builder.addCase(updateColumn.fulfilled, (state, action) => {
      const index = state.columns.findIndex(
        (col) => col._id === action.payload._id,
      );
      if (index !== -1) {
        state.columns[index] = action.payload;
      }
    });

    // DELETE
    builder.addCase(deleteColumn.fulfilled, (state, action) => {
      console.log("🚀 ~ action:", action)
      console.log("🚀 ~ state:", state)
      state.columns = state.columns.filter((col) => col._id !== action.payload);
    });

    // REORDER
    builder.addCase(reorderColumns.fulfilled, (state, action) => {
      state.columns = action.payload;
    });
  },
});

export default columnSlice.reducer;
