"use client";
import { useState, useEffect, useMemo } from "react";
import {
  fetchNotes,
  updateNotesOrder,
} from "../../redux/slices/note-slice";
import { Box, Grid } from "@mui/system";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import debounce from "lodash.debounce";
import CloseIcon from "@mui/icons-material/Close";
import { Note } from "@/types/notes/note";
import { RootState } from "@/types/notes/note-redux";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { DialogState } from "@/types/components/note-dialouge";
import NoteCard from "./common/NoteCard";
import NoteDialog from "./common/NoteDialog";
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  useSensors,
  PointerSensor,  
  useSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableNote from "./common/SortableNote";

export default function NoteList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(9);
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const dispatch = useAppDispatch();
  const { notes, total } = useAppSelector((state: RootState) => state.note);
  console.log("🚀 ~ NoteList ~ notes:", notes)
  const totalPages = Math.ceil(total / rowsPerPage);
  const [dialougeData, setDialougeData] = useState<DialogState>({
    open: false,
    type: "create",
    data: null,
    title: "",
  });

  const debounceSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(
          fetchNotes({ category, search: value, page, limit: rowsPerPage }),
        );
      }, 500),
    [category],
  );

  useEffect(() => {
    debounceSearch(search);
    return () => {
      debounceSearch.cancel();
    };
  }, [search]);

  useEffect(() => {
    dispatch(fetchNotes({ category, search, page, limit: rowsPerPage }));
  }, [category, page, rowsPerPage]);



  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const pinned = notes.filter((n) => n.isPinned);
    const others = notes.filter((n) => !n.isPinned);

    const isPinnedSection = pinned.some((n) => n._id === active.id);

    if (isPinnedSection) {
      const oldIndex = pinned.findIndex((n) => n._id === active.id);
      const newIndex = pinned.findIndex((n) => n._id === over.id);
      const newPinned = arrayMove(pinned, oldIndex, newIndex);

      const updatedPinned = newPinned.map((note, index) => ({
        ...note,
        order: index + 1,
      }));

      dispatch(updateNotesOrder({ notes: updatedPinned }));

    } else {
      const oldIndex = others.findIndex((n) => n._id === active.id);
      const newIndex = others.findIndex((n) => n._id === over.id);
      const newOthers = arrayMove(others, oldIndex, newIndex);

      const updatedOthers = newOthers.map((note, index) => ({
        ...note,
        order: index + 1,
      }));

      dispatch(updateNotesOrder({ notes: updatedOthers }));
    }
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const otherNotes = notes.filter((n) => !n.isPinned);

  return (
    <Box sx={{ padding: 4, display: "flex", flexDirection: "column", gap: 3 }}>
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
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <TextField
          size="small"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end" sx={{ width: 20 }}>
                  {search && (
                    <IconButton size="small" onClick={() => setSearch("")}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="personal">Personal</MenuItem>
            <MenuItem value="ideas">Ideas</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() =>
            setDialougeData({
              open: true,
              type: "create",
              data: null,
              title: "Add Notes",
            })
          }
        >
          Add note
        </Button>
      </Box>

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Typography>Pinned note</Typography>

        <SortableContext
          items={pinnedNotes.map((n) => n._id)}
          strategy={verticalListSortingStrategy}
        >
          <Grid container spacing={2}>
            {pinnedNotes.map((note, index) => (
              <SortableNote key={note._id} id={note._id}>
                <NoteCard
                  row={note}
                  index={index}
                  dialougeData={dialougeData}
                  setDialougeData={setDialougeData}
                />
              </SortableNote>
            ))}
          </Grid>
        </SortableContext>
      </DndContext>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Typography> Others</Typography>
        <SortableContext
          items={otherNotes.map((n) => n._id)}
          strategy={verticalListSortingStrategy}
        >
          <Grid container spacing={2} sx={{ justifyContent: "start" }}>
            {otherNotes.map((note: Note, index) => {
              return (
                <SortableNote key={note._id} id={note._id}>
                  <NoteCard
                    key={index}
                    row={note}
                    index={index}
                    dialougeData={dialougeData}
                    setDialougeData={setDialougeData}
                  />
                </SortableNote>
              );
            })}
          </Grid>
        </SortableContext>
      </DndContext>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(e, value) => setPage(value - 1)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
