"use client";

import { Paper } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task._id,
      data: {
        type: "task",
        task,
      },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        p: 1.5,
        background: "white",
        cursor: "grab",
        boxShadow: 1,
      }}
    >
      {task.title}
    </Paper>
  );
}