import { DialogState } from "@/types/components/note-dialouge";
import { Note } from "@/types/notes/note";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import NoteDialog from "./NoteDialog";
import { useAppDispatch } from "@/redux/hooks";
import { deleteNote, updateNote } from "@/redux/slices/note-slice";
import { truncate } from "@/utills/turncate-text";
import PushPinIcon from "@mui/icons-material/PushPin";
import { confirmDeleteAlert } from "@/utills/confirm-alert";
import DeleteIcon from "@mui/icons-material/Delete";

const NoteCard = ({
  row,
  index,
  dialougeData,
  setDialougeData,
}: {
  row: Note;
  index: number;
  dialougeData: DialogState;
  setDialougeData: React.Dispatch<React.SetStateAction<DialogState>>;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dispatch = useAppDispatch();

  const handleTogglePin = (note: Note) => {
    dispatch(
      updateNote({
        id: note._id,
        data: { isPinned: !note.isPinned },
      }),
    );
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    row: Note,
  ) => {
    try {
      e.stopPropagation();
      const result = await confirmDeleteAlert({
        title: "Delete Note?",
        text: "This note will be permanently deleted",
      });

      if (result.isConfirmed) {
        dispatch(deleteNote(row._id));
      }
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
    }
  };

  return (
    <Box>
      <NoteDialog
        open={dialougeData.open}
        type={dialougeData.type}
        title={dialougeData.title}
        data={dialougeData.data}
        handleClose={() => {
          setDialougeData((old) => ({
            ...old,
            open: false,
          }));
        }}
      />

      <Grid
        sx={{
          borderRadius: 2,
          border: 1,
          padding: 2,
          cursor: "pointer",
          "&:hover": { boxShadow: 6 },
          width: "100%",
          minWidth: 420,
        }}
        size={{ xs: 12, md: 5, lg: 4 }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        key={row._id}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            // height: "100%",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setDialougeData({
              open: true,
              type: "edit",
              data: row,
              title: "Edit Notes",
            });
          }}
        >
          {hoveredIndex === index && (
            <IconButton
              sx={{
                position: "absolute",
                top: -3,
                right: -3,
                display: "flex",
                gap: 1,
              }}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePin(row);
              }}
              color={row?.isPinned ? "primary" : "default"}
            >
              <PushPinIcon fontSize="small" />
            </IconButton>
          )}

          <Typography variant="h5">{truncate(row?.title, 40)}</Typography>
          <Typography variant="subtitle2">
            {truncate(row?.content, 100)}
          </Typography>

          {row?.image?.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(row.image.length, 2)}, 1fr)`,
                gap: 1,
                mt: 1,
                height: 120,
                overflowX: "hidden",
              }}
            >
              {row.image.map((img,index) => {
                return (
                  <img
                    src={img?.url}
                    key={index}
                    style={{
                      width: "100%",
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                );
              })}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              margin: 0,
              padding: 0,
              minHeight: 30,
            }}
          >
            {hoveredIndex === index && (
              <IconButton
                sx={{ padding: 0 }}
                size="medium"
                color="error"
                onClick={(e) => handleDelete(e, row)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default NoteCard;
