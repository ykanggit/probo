import { useTranslate } from "@probo/i18n";
import {
  Button,
  IconUpload,
  IconMagnifyingGlass,
  IconFilter,
  IconImage,
  IconPageTextLine,
  IconTrashCan,
} from "@probo/ui";
import { useState, useEffect, useCallback } from "react";
import { graphql, useMutation } from "react-relay";
import type { FilePreviewGetFileContentMutation } from "./__generated__/FilePreviewGetFileContentMutation.graphql";

const getFileContentMutation = graphql`
  mutation FilePreviewGetFileContentMutation($input: GetFileContentInput!) {
    getFileContent(input: $input) {
      content
      fileName
      fileType
      fileSize
    }
  }
`;

type FilePreviewProps = {
  documentVersionId: string;
  fileName?: string | null;
  fileSize?: number | null;
  fileType?: string | null;
  onDelete?: () => void;
};

export function FilePreview({
  documentVersionId,
  fileName,
  fileSize,
  fileType,
  onDelete,
}: FilePreviewProps) {
  const { __ } = useTranslate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [getFileContent] = useMutation<FilePreviewGetFileContentMutation>(getFileContentMutation);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPreviewOpen) {
        setIsPreviewOpen(false);
      }
    };

    if (isPreviewOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isPreviewOpen]);

  // Handle click outside to close modal
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setIsPreviewOpen(false);
    }
  }, []);

  const handlePreview = async () => {
    if (!documentVersionId) return;

    setIsLoading(true);
    try {
      const result = await new Promise<FilePreviewGetFileContentMutation['response']>((resolve, reject) => {
        getFileContent({
          variables: {
            input: {
              documentVersionId,
            },
          },
          onCompleted: (response) => resolve(response),
          onError: (error) => reject(error),
        });
      });

      if (result?.getFileContent?.content) {
        setPreviewContent(result.getFileContent.content);
        setIsPreviewOpen(true);
      }
    } catch (error) {
      console.error("Failed to get file content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!documentVersionId) return;

    setIsLoading(true);
    try {
      const result = await new Promise<FilePreviewGetFileContentMutation['response']>((resolve, reject) => {
        getFileContent({
          variables: {
            input: {
              documentVersionId,
            },
          },
          onCompleted: (response) => resolve(response),
          onError: (error) => reject(error),
        });
      });

      if (result?.getFileContent?.content) {
        // Convert base64 to blob and download
        const binaryString = atob(result.getFileContent.content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: result.getFileContent.fileType || 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = result.getFileContent.fileName || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = () => {
    if (!fileType) return IconFilter;
    
    if (fileType.startsWith('image/')) return IconImage;
    if (fileType.includes('pdf') || fileType.includes('document')) return IconPageTextLine;
    return IconFilter;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderPreview = () => {
    if (!previewContent || !fileType) return null;

    if (fileType.startsWith('image/')) {
      // For images, convert base64 to data URL
      const dataUrl = `data:${fileType};base64,${previewContent}`;
      return (
        <div className="flex justify-center">
          <div className="max-w-full max-h-[70vh] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
            <img 
              src={dataUrl} 
              alt={fileName || 'Image'} 
              className="max-w-full h-auto rounded shadow-sm" 
            />
          </div>
        </div>
      );
    }

    if (fileType.includes('pdf')) {
      // For PDFs, show a message (could be enhanced with PDF.js)
      return (
        <div className="text-center py-12">
          <IconPageTextLine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">{__("PDF Preview")}</h4>
          <p className="text-gray-600 mb-4">{__("PDF preview is not available in the browser.")}</p>
          <Button
            variant="primary"
            onClick={handleDownload}
            icon={IconUpload}
          >
            {__("Download PDF")}
          </Button>
        </div>
      );
    }

    if (fileType.includes('text/') || fileType.includes('document')) {
      // For text files, decode and display content
      try {
        const textContent = atob(previewContent);
        return (
          <div className="max-w-full max-h-[70vh] overflow-auto">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <IconPageTextLine className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{__("Text Content")}</span>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {textContent}
              </pre>
            </div>
          </div>
        );
      } catch (error) {
        return (
          <div className="text-center py-12">
            <IconFilter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">{__("Preview Unavailable")}</h4>
            <p className="text-gray-600">{__("Unable to preview this file type.")}</p>
          </div>
        );
      }
    }

    return (
      <div className="text-center py-12">
        <IconFilter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">{__("Preview Unavailable")}</h4>
        <p className="text-gray-600">{__("Preview not available for this file type.")}</p>
      </div>
    );
  };

  if (!fileName) {
    return (
      <div className="text-gray-400 text-sm">
        {__("No file attached")}
      </div>
    );
  }

  const FileIcon = getFileIcon();

  return (
    <div className="space-y-4">
      {/* File Info */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <FileIcon className="w-8 h-8 text-gray-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
          <p className="text-xs text-gray-500">
            {fileSize ? formatFileSize(fileSize) : ''} • {fileType || 'Unknown type'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={handlePreview}
            disabled={isLoading}
            icon={IconMagnifyingGlass}
          >
            {__("Preview")}
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={isLoading}
            icon={IconUpload}
          >
            {__("Download")}
          </Button>
          {onDelete && (
            <Button
              variant="danger"
              onClick={onDelete}
              icon={IconTrashCan}
            >
              {__("Delete")}
            </Button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
            {/* Header with solid background */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <FileIcon className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900">{fileName}</h3>
              </div>
              <Button
                variant="secondary"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 font-medium hover:bg-gray-200 transition-colors"
              >
                {__("Close")}
              </Button>
            </div>
            
            {/* Content area */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)] bg-white">
              {renderPreview()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
