import React, { useState, useMemo } from 'react';
import type { SelectedFile } from '../types';
import { FileIcon, TrashIcon, SearchIcon } from './icons';
import FileListItem from './FileListItem';

interface FileListProps {
  files: SelectedFile[];
  onRemoveFile: (fileName: string) => void;
  emptyMessage: string;
  emptyHint: string;
  searchPlaceholder?: string;
}

const FileList: React.FC<FileListProps> = ({ files, onRemoveFile, emptyMessage, emptyHint, searchPlaceholder }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const query = searchQuery.toLowerCase();
    return files.filter(file => file.name.toLowerCase().includes(query));
  }, [files, searchQuery]);

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
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="relative mb-3">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder || 'Tìm kiếm files...'}
          className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        {searchQuery && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {filteredFiles.length}/{files.length}
          </span>
        )}
      </div>

      {/* File list */}
      <div className="space-y-2 p-2 flex-1 overflow-y-auto">
        {filteredFiles.length === 0 ? (
          <div className="text-center text-slate-400 py-4 text-sm">
            Không tìm thấy file phù hợp
          </div>
        ) : (
          filteredFiles.map((file) => (
            <FileListItem
              key={file.name}
              file={file}
              onAction={onRemoveFile}
              actionIcon={<TrashIcon className="w-5 h-5" />}
              actionTitle="Remove file"
              actionIconClass="text-slate-400 hover:text-red-400"
              isIncluded={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FileList;