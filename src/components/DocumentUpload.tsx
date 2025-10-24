import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpload } from "@/hook/useUpload";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  file: File | null;
  required: boolean;
}

interface DocumentUploadProps {
  companyName: string;
  documents: Document[];
  onBack: () => void;
}

export default function DocumentUpload({
  companyName,
  documents,
  onBack,
}: DocumentUploadProps) {
  const [documentFiles, setDocumentFiles] = useState<Document[]>(documents);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const { uploadDocumentsMutation, loading } = useUpload();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (documentId: string, file: File | null) => {
    setDocumentFiles((prev) =>
      prev.map((doc) => (doc.id === documentId ? { ...doc, file } : doc))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await uploadDocumentsMutation({
        companyName,
        documents: documentFiles,
      });
      toast.success("Documents uploaded successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
    }
  };

  const handleRemoveFile = (documentId: string) => {
    handleFileChange(documentId, null);
  };

  const handleDragOver = (e: React.DragEvent, documentId: string) => {
    e.preventDefault();
    setDragOver(documentId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, documentId: string) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(documentId, file);
    }
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("word") || type.includes("document")) return "📝";
    return "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Upload Documents
        </h2>
        <p className="text-sm text-gray-600">
          Upload all required documents below
        </p>
      </div>

      {/* Document Upload Areas */}
      <div className="space-y-3">
        {documentFiles.map((document) => (
          <div
            key={document.id}
            className="border border-gray-200 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {document.name}
                  {document.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </span>
              </div>
            </div>

            {!document.file ? (
              <div
                className={`border-2 border-dashed rounded p-3 text-center ${
                  dragOver === document.id
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300"
                }`}
                onDragOver={(e) => handleDragOver(e, document.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, document.id)}
              >
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload or drag file here
                </p>
                <Button
                  type="button"
                  onClick={() => fileInputRefs.current[document.id]?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                >
                  Choose File
                </Button>
                <Input
                  ref={(el) => {
                    fileInputRefs.current[document.id] = el;
                  }}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleFileChange(document.id, file);
                  }}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {getFileIcon(document.file)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {document.file.name}
                      </p>
                      <p className="text-xs text-green-600">
                        {formatFileSize(document.file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleRemoveFile(document.id)}
                    className="text-red-600 hover:text-red-700 text-xs"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded text-sm"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={
            loading || documentFiles.some((doc) => doc.required && !doc.file)
          }
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
