import React, { useEffect } from 'react';
import type { SelectedFile } from '../types';
import FileSelector from './FileSelector';
import FileList from './FileList';
import ExcludedFileList from './ExcludedFileList';
import SensitiveFileList from './SensitiveFileList';
import LogPanel from './LogPanel';
import { DownloadIcon } from './icons';

interface ConfigurePanelProps {
  t: any;
  isLoading: boolean;
  onFilesSelected: (files: File[]) => void;
  selectedFiles: SelectedFile[];
  whitelistedOutFiles: SelectedFile[];
  sensitiveFiles: SelectedFile[];
  onClearAll: () => void;
  onRemoveFile: (fileName: string) => void;
  onIncludeFile: (fileName: string) => void;
  onIncludeSensitiveFile: (fileName: string) => void;
  isLargeProject: boolean;
  onCombineAndDownload: () => void;
  logs: string[];
  logContainerRef: React.RefObject<HTMLDivElement>;
}

const ConfigurePanel: React.FC<ConfigurePanelProps> = ({
  t,
  isLoading,
  onFilesSelected,
  selectedFiles,
  whitelistedOutFiles,
  sensitiveFiles,
  onClearAll,
  onRemoveFile,
  onIncludeFile,
  onIncludeSensitiveFile,
  isLargeProject,
  onCombineAndDownload,
  logs,
  logContainerRef
}) => {
    
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, logContainerRef]);

  return (
    <>
      <FileSelector
        onFilesSelected={onFilesSelected}
        isLoading={isLoading}
        buttonText={t.selectProjectFolder}
        loadingText={t.processing}
      />
      <div className="flex-grow flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">
            {t.selectedFiles}{" "}
            {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </h3>
          <button
            onClick={onClearAll}
            className="text-sm text-sky-400 hover:text-sky-300 disabled:text-slate-500"
            disabled={selectedFiles.length === 0 && whitelistedOutFiles.length === 0 && sensitiveFiles.length === 0}
          >
            {t.clearAll}
          </button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2 bg-slate-900/50 rounded-lg border border-slate-700 min-h-[15rem] max-h-80">
          <FileList
            files={selectedFiles}
            onRemoveFile={onRemoveFile}
            emptyMessage={t.noFilesSelected}
            emptyHint={t.noFilesHint}
          />
        </div>
      </div>

      <SensitiveFileList
        files={sensitiveFiles}
        onIncludeFile={onIncludeSensitiveFile}
        title={t.sensitiveFilesTitle}
        hint={t.sensitiveFilesHint}
      />

      <ExcludedFileList
        files={whitelistedOutFiles}
        onIncludeFile={onIncludeFile}
        title={t.excludedFilesTitle}
        hint={t.excludedFilesHint}
      />



      <LogPanel logs={logs} t={t} logContainerRef={logContainerRef} />
    </>
  );
};

export default ConfigurePanel;