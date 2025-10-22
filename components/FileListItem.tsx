import React from 'react';
import type { SelectedFile } from '../types';
import { formatBytes } from '../utils/format';
import { FileIcon, WarningIcon } from './icons';

interface FileListItemProps {
  file: SelectedFile;
  actionIcon: React.ReactNode;
  onAction: (fileName: string) => void;
  actionTitle: string;
  actionIconClass: string;
  isIncluded: boolean;
  isWarning?: boolean;
}

const FileListItem: React.FC<FileListItemProps> = ({
  file,
  actionIcon,
  onAction,
  actionTitle,
  actionIconClass,
  isIncluded,
  isWarning = false,
}) => {
  let iconColor = isIncluded ? 'text-sky-400' : 'text-slate-500';
  if (isWarning) {
    iconColor = 'text-amber-400';
  }
  const textColor = isWarning ? 'text-amber-200' : (isIncluded ? 'text-slate-100' : 'text-slate-300');
  const sizeColor = isWarning ? 'text-slate-400' : (isIncluded ? 'text-slate-400' : 'text-slate-500');

  const MainIcon = isWarning ? WarningIcon : FileIcon;

  return (
    <div className={`flex items-center p-2 rounded-lg shadow-sm animate-fade-in ${isWarning ? 'bg-amber-900/20' : 'bg-slate-800'}`}>
      <MainIcon className={`w-6 h-6 ${iconColor} mr-3 flex-shrink-0`} />
      <div className="flex-grow min-w-0">
        <p className={`text-sm font-medium ${textColor} truncate`} title={file.name}>{file.name}</p>
        <p className={`text-xs ${sizeColor}`}>{formatBytes(file.size)}</p>
      </div>
      <button 
        onClick={() => onAction(file.name)} 
        title={actionTitle} 
        className={`ml-3 p-2 rounded-full hover:bg-slate-700 transition-colors duration-200 flex-shrink-0 ${actionIconClass}`}
      >
        {actionIcon}
      </button>
    </div>
  );
};

export default FileListItem;