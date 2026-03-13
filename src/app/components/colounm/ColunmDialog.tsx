"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

type Props = {
  open: boolean;
  title: string;
  value: string;
  setValue: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  buttonText: string;
};

export default function ColumnDialog({
  open,
  title,
  value,
  setValue,
  onClose,
  onSubmit,
  buttonText,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Column Name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ mt: 2, minWidth:"400px" }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={onSubmit}>
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}