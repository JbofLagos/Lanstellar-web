import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDocuments, type ApiResponse } from "@/lib/api-service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Document {
  id: string;
  name: string;
  file: File | null;
  required: boolean;
}

interface UploadDocumentsData {
  companyName: string;
  documents: Document[];
}

export const useUpload = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: uploadDocumentsMutation, isPending } = useMutation({
    mutationKey: ["uploadDocuments"],
    mutationFn: async (data: UploadDocumentsData) => {
      console.log("Uploading documents with data:", data);

      // Validate that all required documents are provided
      const missingRequiredDocs = data.documents.filter(
        (doc) => doc.required && !doc.file
      );

      if (missingRequiredDocs.length > 0) {
        throw new Error(
          `Missing required documents: ${missingRequiredDocs
            .map((doc) => doc.name)
            .join(", ")}`
        );
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Send bankName as expected by backend
      formData.append("bankName", data.companyName);

      // Create files array
      const files: File[] = [];
      data.documents.forEach((doc) => {
        if (doc.file) {
          files.push(doc.file);
        }
      });

      // Send files as array - each file with same key
      files.forEach((file) => {
        formData.append("files", file);
      });

      // Log FormData contents for debugging
      console.log("FormData contents:");
      console.log("bankName:", data.companyName);
      console.log("files count:", files.length);
      console.log(
        "Files being sent:",
        files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
      );

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      return await uploadDocuments(formData);
    },
    onSuccess(data: ApiResponse) {
      if (data.success) {
        console.log("Documents uploaded successfully!");
        // Invalidate user query to refetch user data
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast.success("Documents uploaded successfully");
        navigate("/dashboard");
      }
    },
    onError(error) {
      console.log("Upload error:", error);
    },
  });

  return { uploadDocumentsMutation, loading: isPending };
};
