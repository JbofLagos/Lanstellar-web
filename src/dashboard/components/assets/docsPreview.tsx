import React from "react";
import { File } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface Doc {
  cloudinaryUrl: string;
  filename?: string;
}

interface DocsPreviewProps {
  docs: string | Doc[];
}

const DocsPreview: React.FC<DocsPreviewProps> = ({ docs }) => {
  const normalizedDocs: Doc[] = Array.isArray(docs)
    ? docs
    : docs
    ? [{ cloudinaryUrl: docs }]
    : [];

  const pdfUrl = normalizedDocs[0]?.cloudinaryUrl || null;
  const fileName = normalizedDocs[0]?.filename || "";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer w-fit px-6 focus:outline-none items-center justify-start gap-1 text-[13px] text-[#292D32] bg-[#F7F7F8] rounded-[8px] p-[4px] h-8 hover:bg-[#F7F7F8] font-medium">
          <img
            src="/icons/document.svg"
            alt="Document"
            width={16}
            height={16}
            className="text-[#292D32]"
          />
          Preview asset documents
        </div>
      </SheetTrigger>
      <SheetContent className="!max-w-[600px]">
        <SheetTitle>
          <div className="">{fileName}</div>
          {pdfUrl ? (
            <div>
              <iframe
                src={pdfUrl}
                className="w-full h-[80vh] rounded-lg"
                title="PDF Preview"
              ></iframe>
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <File />
                </EmptyMedia>
                <EmptyTitle>No File Loaded Yet</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
        </SheetTitle>
      </SheetContent>
    </Sheet>
  );
};

export default DocsPreview;
