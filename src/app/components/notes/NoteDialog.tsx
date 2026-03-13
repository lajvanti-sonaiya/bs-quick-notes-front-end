import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import {
  Box,
  FormHelperText,
  IconButton,
  MenuItem,
  Skeleton,
  TextField,
} from "@mui/material";
import { noteSchema } from "@/validation/note-validation";
import {
  createNote,
  imageDelete,
  imageUpload,
  updateNote,
} from "@/redux/slices/note-slice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { NoteDialogProps } from "@/types/notes/note";
import styled from "@emotion/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const NoteDialog = ({
  open,
  title,
  data,
  handleClose,
  type,
}: NoteDialogProps) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.note);
  const [images, setImages] = React.useState<
    { id: string; url: string; uploading: boolean; isNew: boolean }[]
  >([]);

  const [imgIndex, setImgIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        title: data?.title || "",
        content: data?.content || "",
        category: data?.category || "",
        image: "",
      },
      validationSchema: noteSchema,
      onSubmit: async () => {
        handleSubmitNote();
      },
    });

  const handleSubmitNote = () => {
    try {
      setIsSubmitted(true);
      if (type === "create") {
        dispatch(
          createNote({
            ...values,
            image: images
              .filter((img) => !img.uploading)
              .map((img) => ({
                url: img.url,
                public_id: img.id,
              })),
          }),
        );
      }
      if (type === "edit") {
        dispatch(
          updateNote({
            id: data._id,
            data: {
              ...values,
              image: images
                .filter((img) => !img.uploading)
                .map((img) => ({
                  url: img.url,
                  public_id: img.id,
                })),
            },
          }),
        );
      }
      resetForm();
      handleClose();
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const handleFileupload = async (files: FileList) => {
    const fileArray = Array.from(files);
    const formData = new FormData();

    const newImages = fileArray.map(() => ({
      id: uuidv4(),
      url: null,
      uploading: true,
      isNew: true,
    }));
    setImages((prev) => [...prev, ...newImages]);
    fileArray.forEach((file) => formData.append("images", file));

    try {
      const res = await dispatch(imageUpload(formData)).unwrap();
      const uploadedUrls = await res;

      setImages((prev) =>
        prev.map((img) => {
          const index = newImages.findIndex((n) => n.id === img.id);

          if (index !== -1) {
            return {
              ...img,
              id: uploadedUrls[index].public_id,
              url: uploadedUrls[index].url,
              uploading: false,
            };
          }

          return img;
        }),
      );
    } catch (error) {
      setImages((prev) =>
        prev.map((img) => (img.uploading ? { ...img, uploading: false } : img)),
      );
    }
  };

  const handleImageDelete = (id) => {
    dispatch(imageDelete([id]));
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  useEffect(() => {
    if (data?.image) {
      setImages(
        data.image.map((img) => ({
          id: img?.public_id,
          url: img?.url,
          uploading: false,
          isNew: false,
        })),
      );
    } else {
      setImages([]);
    }
  }, [data, open]);

  useEffect(() => {
    if (!open && !isSubmitted) {
      const idsToDelete = images
        .filter((img) => !img.uploading && img.isNew)
        .map((img) => img.id);

      if (idsToDelete.length > 0) {
        dispatch(imageDelete(idsToDelete));
      }
    }
  }, [open, images, isSubmitted]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent sx={{ padding: "30px", minWidth: "400px" }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && String(errors.title ?? "")}
          />
          <FormHelperText
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              fontSize: "12px",
              color: "text.secondary",
              mt: "2px",
            }}
          >
            {values.title.length}/100 characters
          </FormHelperText>

          <TextField
            fullWidth
            margin="normal"
            label="Content"
            name="content"
            multiline
            rows={4}
            value={values.content}
            onChange={handleChange}
            error={touched.content && Boolean(errors.content)}
            helperText={touched.content && String(errors.content ?? "")}
          />

          <FormHelperText
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              fontSize: "12px",
              color: "text.secondary",
              mt: "2px",
            }}
          >
            {values.content.length}/500 characters
          </FormHelperText>

          <TextField
            fullWidth
            select
            margin="normal"
            label="Category"
            sx={{ minWidth: 200 }}
            name="category"
            value={values.category}
            onChange={handleChange}
            error={touched.category && Boolean(errors.category)}
            helperText={touched.category && String(errors.category ?? "")}
          >
            <MenuItem value="personal">Personal</MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="ideas">Ideas</MenuItem>
          </TextField>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
            }}
          >
            {images.map((img, index) => (
              <Box
                key={img.id}
                sx={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  marginBottom: 4,
                  "&:hover .delete-icon": {
                    opacity: 1,
                  },
                }}
              >
                {img.uploading && (
                  <Skeleton variant="rectangular" width={100} height={100} />
                )}

                {!img.uploading && (
                  <>
                    <img
                      src={img?.url}
                      style={{
                        width: "100%",
                        height: "80%",
                        borderRadius: 2,
                      }}
                      onClick={() => setImgIndex(index)}
                    />
                    <DeleteIcon
                      className="delete-icon"
                      onClick={() => handleImageDelete(img.id)}
                      sx={{
                        color: "white",
                        backgroundColor: "gray",
                        padding: "2px",
                        borderRadius: 1,
                        position: "absolute",
                        cursor: "pointer",
                        top: 5,
                        right: 5,
                        opacity: 0,
                      }}
                    />
                  </>
                )}
              </Box>
            ))}
          </Box>

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => handleFileupload(event.target.files)}
              multiple
            />
          </Button>

          <Dialog fullScreen open={imgIndex !== null}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                background: "black",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                onClick={() => setImgIndex(null)}
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  color: "white",
                  zIndex: 10,
                }}
              >
                <CloseIcon />
              </IconButton>
              <Swiper
                modules={[Navigation, Keyboard]}
                navigation
                initialSlide={imgIndex || 0}
                style={{ width: "100%", height: "100%" }}
                keyboard={{ enabled: true }}
              >
                {images.map((img) => (
                  <SwiperSlide key={img.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <img
                        src={img.url}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
            {errors.image && (
              <FormHelperText color="red">{errors.image}</FormHelperText>
            )}
          </Dialog>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || images.some((img) => img.uploading)}
            >
              {type === "create" ? "Add Note" : "Update Note"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(NoteDialog);
