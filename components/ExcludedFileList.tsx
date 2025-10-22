import React from 'react';
import type { SelectedFile } from '../types';
import { PlusCircleIcon } from './icons';
import FileListItem from './FileListItem';

interface ExcludedFileListProps {
  files: SelectedFile[];
  onIncludeFile: (fileName: string) => void;
  title: string;
  hint: string;
}

const ExcludedFileList: React.FC<ExcludedFileListProps> = ({ files, onIncludeFile, title, hint }) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-3">{hint}</p>
      <div className="space-y-2 p-2 max-h-60 overflow-y-auto pr-2 bg-slate-900/50 rounded-lg border border-slate-700">
        {files.map((file) => (
          <FileListItem
            key={file.name}
            file={file}
            onAction={onIncludeFile}
            actionIcon={<PlusCircleIcon className="w-5 h-5" />}
            actionTitle="Include this file"
            actionIconClass="text-slate-400 hover:text-green-400"
            isIncluded={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ExcludedFileList;