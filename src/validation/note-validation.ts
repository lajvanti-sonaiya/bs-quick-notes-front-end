import * as Yup from "yup";

export const noteSchema = Yup.object({
  title: Yup.string()
    .max(100, "Max 100 characters")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Max 500 characters")
    .required("Content is required"),
  category: Yup.string()
    .oneOf(["personal", "work", "ideas"])
    .required("Category is required"),
});