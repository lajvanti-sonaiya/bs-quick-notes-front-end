  import Swal from "sweetalert2";

  export const confirmDeleteAlert = async ({
    title = "Are you sure?",
    text = "This action cannot be undone!",
    confirmButtonText = "Yes, delete it!",
  }) => {
    return await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
  };
