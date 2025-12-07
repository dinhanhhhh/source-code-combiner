import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface FileSelectorProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
  buttonText: string;
  loadingText: string;
  dropHint?: string;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFilesSelected, isLoading, buttonText, loadingText, dropHint }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
      event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Recursively get all files from directory entries
  const getFilesFromEntry = async (entry: FileSystemEntry): Promise<File[]> => {
    if (entry.isFile) {
      return new Promise((resolve) => {
        (entry as FileSystemFileEntry).file((file) => {
          // Preserve relative path
          Object.defineProperty(file, 'webkitRelativePath', {
            value: entry.fullPath.slice(1), // Remove leading slash
            writable: false,
          });
          resolve([file]);
        });
      });
    } else if (entry.isDirectory) {
      const dirReader = (entry as FileSystemDirectoryEntry).createReader();
      const entries = await new Promise<FileSystemEntry[]>((resolve) => {
        dirReader.readEntries((entries) => resolve(entries));
      });
      const files = await Promise.all(entries.map(getFilesFromEntry));
      return files.flat();
    }
    return [];
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isLoading) return;

    const items = e.dataTransfer.items;
    const allFiles: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) {
        const files = await getFilesFromEntry(entry);
        allFiles.push(...files);
      }
    }

    if (allFiles.length > 0) {
      onFilesSelected(allFiles);
    }
  }, [isLoading, onFilesSelected]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  }, [isLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
        // @ts-ignore - Non-standard attributes for directory selection
        webkitdirectory=""
        mozdirectory=""
      />
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full border-2 border-dashed rounded-lg transition-all duration-200 ${
          isDragging 
            ? 'border-sky-400 bg-sky-500/20' 
            : 'border-slate-600 hover:border-slate-500'
        }`}
      >
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="w-full flex flex-col items-center justify-center gap-2 px-6 py-6 bg-transparent text-white font-semibold rounded-lg hover:bg-slate-700/50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <UploadIcon className={`w-8 h-8 ${isDragging ? 'text-sky-400' : 'text-sky-500'}`} />
          <span className="text-base">{isLoading ? loadingText : buttonText}</span>
          <span className="text-xs text-slate-400 font-normal">
            {dropHint || 'hoặc kéo thả thư mục vào đây'}
          </span>
        </button>
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-sky-500/10 rounded-lg pointer-events-none">
            <span className="text-sky-400 font-semibold">Thả để chọn thư mục</span>
          </div>
        )}
      </div>
    </>
  );
};

export default FileSelector;

