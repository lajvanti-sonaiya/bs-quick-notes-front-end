"use client";

import { useState, useMemo } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  TextField,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/types/notes/note-redux";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { deleteColumn, updateColumn } from "@/redux/slices/column-slice";
import { createTask } from "@/redux/slices/task-slice";

import ColumnDialog from "./ColunmDialog";
import TaskCard from "../tasks/TaskCard";

export default function Column({ column }) {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state: RootState) => state.tasks);

  /* Filter tasks for this column */
  const columnTasks = useMemo(() => {
    return tasks
      .filter((task) => task.columnId === column._id)
      .sort((a, b) => a.orderId - b.orderId);
  }, [tasks, column._id]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState(column.name);

  const [addingTask, setAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column._id,
      data: {
        type: "column",
      },
    });

  const { setNodeRef: setDropRef } = useDroppable({
    id: column._id,
    data: {
      type: "column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleDelete = () => {
    dispatch(deleteColumn(column._id));
    closeMenu();
  };

  const handleUpdate = () => {
    dispatch(updateColumn({ id: column._id, name }));
    setOpenEdit(false);
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim()) return;

    dispatch(
      createTask({
        title: taskTitle.trim(),
        columnId: column._id,
      })
    );

    setTaskTitle("");
    setAddingTask(false);
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        minWidth: 280,
        background: "#f4f5f7",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          cursor: "grab",
        }}
      >
        <Typography fontWeight="bold">{column.name}</Typography>

        <IconButton size="small" onClick={openMenu}>
          <MoreHorizIcon />
        </IconButton>
      </Box>

      <Box
        ref={setDropRef}
        sx={{
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <SortableContext
          items={columnTasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {columnTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </SortableContext>
      </Box>

      {!addingTask ? (
        <Button
          fullWidth
          variant="text"
          sx={{ mt: 1 }}
          onClick={() => setAddingTask(true)}
        >
          + Add Task
        </Button>
      ) : (
        <Box sx={{ mt: 1 }}>
          <TextField
            multiline
            minRows={2}
            fullWidth
            placeholder="Enter a title for this card..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCreateTask();
              }
            }}
          />

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button variant="contained" onClick={handleCreateTask}>
              Add Card
            </Button>

            <Button onClick={() => setAddingTask(false)}>Cancel</Button>
          </Box>
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            setOpenEdit(true);
            closeMenu();
          }}
        >
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <ColumnDialog
        open={openEdit}
        title="Edit Column"
        value={name}
        setValue={setName}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleUpdate}
        buttonText="Update"
      />
    </Box>
  );
}