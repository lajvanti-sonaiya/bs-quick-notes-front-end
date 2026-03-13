"use client";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Column from "./colounm/Colunm";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchColumns,
  createColumn,
  reorderColumns,
} from "@/redux/slices/column-slice";
import { RootState } from "@/types/notes/note-redux";

import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import ColumnDialog from "./colounm/ColunmDialog";
import { fetchTasks, updateTaskOrder } from "@/redux/slices/task-slice";

export default function Board() {
  const dispatch = useAppDispatch();
  const { columns, loading } = useAppSelector(
    (state: RootState) => state.columns,
  );
  const role = useAppSelector((state: RootState) => state.user.user?.role);
  const { tasks } = useAppSelector((state: RootState) => state.tasks);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchColumns());
  }, []);

  const handleCreateColumn = () => {
    if (!name.trim()) return;
    dispatch(createColumn(name));
    setName("");
    setOpen(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeType = active.data.current?.type;

    if (activeType === "column") {
      const oldIndex = columns.findIndex((col) => col._id === active.id);
      const newIndex = columns.findIndex((col) => col._id === over.id);

      if (oldIndex === newIndex) return;

      const updated = arrayMove(columns, oldIndex, newIndex).map(
        (col, index) => ({
          ...col,
          order: index + 1,
        }),
      );

      dispatch(reorderColumns(updated));
      return;
    }

    if (activeType === "task") {
      const activeTask = tasks.find((task) => task._id === active.id);
      const overTask = tasks.find((task) => task._id === over.id);

      if (!activeTask) return;

      let newColumnId = activeTask.columnId;

      /* dropped on task */
      if (overTask) {
        newColumnId = overTask.columnId;
      }

      /* dropped on column */
      if (columns.some((col) => col._id === over.id)) {
        newColumnId = over.id;
      }

      const columnTasks = tasks
        .filter(
          (task) => task.columnId === newColumnId && task._id !== active.id,
        )
        .sort((a, b) => a.orderId - b.orderId);

      let newIndex = columnTasks.length;

      if (overTask) {
        newIndex = columnTasks.findIndex((t) => t._id === overTask._id);
      }

      columnTasks.splice(newIndex, 0, {
        ...activeTask,
        columnId: newColumnId,
      });

      const reordered = columnTasks.map((task, index) => ({
        ...task,
        orderId: index + 1,
      }));
      dispatch(updateTaskOrder(reordered));
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowX: "scroll",
      }}
    >
      {/* ADMIN ONLY */}
      {role === "admin" && (
        <Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            startIcon={<AddIcon />}
          >
            Add Column
          </Button>
        </Box>
      )}

      {/* Column List */}
      <Box sx={{ overflowX: "scroll", padding: "12px" }}>
        <DndContext
          sensors={role === "admin" ? sensors : undefined}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map((col) => col._id)}
            strategy={horizontalListSortingStrategy}
          >
            {!loading && (
              <>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {columns.map((column) => (
                    <Column key={column._id} column={column} />
                  ))}
                </Box>
              </>
            )}
          </SortableContext>
        </DndContext>
      </Box>

      {/* Dialog */}

      <ColumnDialog
        open={open}
        title="Create Column"
        value={name}
        setValue={setName}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateColumn}
        buttonText="Create"
      />
    </Box>
  );
}
