import React from 'react';
import type { SelectedFile } from '../types';
import { FileIcon, TrashIcon } from './icons';
import FileListItem from './FileListItem';

interface FileListProps {
  files: SelectedFile[];
  onRemoveFile: (fileName: string) => void;
  emptyMessage: string;
  emptyHint: string;
}

const FileList: React.FC<FileListProps> = ({ files, onRemoveFile, emptyMessage, emptyHint }) => {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500 h-full">
        <FileIcon className="w-12 h-12 mb-4" />
        <p className="font-semibold">{emptyMessage}</p>
        <p className="text-sm">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {files.map((file) => (
        <FileListItem
          key={file.name}
          file={file}
          onAction={onRemoveFile}
          actionIcon={<TrashIcon className="w-5 h-5" />}
          actionTitle="Remove file"
          actionIconClass="text-slate-400 hover:text-red-400"
          isIncluded={true}
        />
      ))}
    </div>
  );
};

export default FileList;