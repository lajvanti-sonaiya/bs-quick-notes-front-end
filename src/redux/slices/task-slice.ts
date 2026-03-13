import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios-instance";

/* Fetch Tasks */
export const fetchTasks = createAsyncThunk("tasks/fetch", async () => {
  const res = await axiosInstance.get("/tasks");
  return res.data.data;
});

/* Create Task */
export const createTask = createAsyncThunk(
  "tasks/create",
  async (data: { title: string; columnId: string }) => {
    const res = await axiosInstance.post("/tasks", data);
    return res.data.data;
  }
);

/* Update Task */
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }: { id: string; data: any }) => {
    const res = await axiosInstance.patch(`/tasks/${id}`, data);
    return res.data.data;
  }
);

/* Delete Task */
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string) => {
    await axiosInstance.delete(`/tasks/${id}`);
    return id;
  }
);

/* Reorder Tasks (Drag & Drop) */
export const updateTaskOrder = createAsyncThunk(
  "tasks/reorder",
  async (tasks: any[]) => {
    await axiosInstance.patch("/tasks/updateTaskOrder", { tasks });
    return tasks;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    /* Fetch Tasks */
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchTasks.rejected, (state) => {
      state.loading = false;
    });

    /* Create Task */
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    });

    /* Update Task */
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task._id === action.payload._id
      );
      if (index !== -1) state.tasks[index] = action.payload;
    });

    /* Delete Task */
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter(
        (task) => task._id !== action.payload
      );
    });

    /* Reorder Tasks */
    builder.addCase(updateTaskOrder.fulfilled, (state, action) => {
      action.payload.forEach((updatedTask) => {
        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      });
    });
  },
});

export default taskSlice.reducer;