import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface FileSelectorProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
  buttonText: string;
  loadingText: string;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFilesSelected, isLoading, buttonText, loadingText }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
      // Reset input value to allow selecting the same file(s) again
      event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

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
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <UploadIcon className="w-6 h-6" />
        {isLoading ? loadingText : buttonText}
      </button>
    </>
  );
};

export default FileSelector;
