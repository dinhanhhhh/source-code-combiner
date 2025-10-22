import React from 'react';
import type { SelectedFile } from '../types';

interface PreviewPanelProps {
  t: any;
  isLoading: boolean;
  combinedContent: string;
  isLargeProject: boolean;
  selectedFiles: SelectedFile[];
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  t,
  isLoading,
  combinedContent,
  isLargeProject,
  selectedFiles,
}) => {
  return (
    <div className="relative flex-grow bg-slate-900 rounded-lg border border-slate-700">
      <pre className="absolute inset-0 overflow-auto p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">
        <code>
          {isLoading && !combinedContent ? (
             <span className="text-slate-500 flex items-center justify-center h-full">
                {t.processing}...
             </span>
          ) : combinedContent ? (
             combinedContent
          ) : isLargeProject && selectedFiles.length > 0 ? (
             <span className="text-slate-500 flex flex-col items-center justify-center h-full text-center p-4">
               <h4 className="font-semibold text-lg text-amber-400 mb-2">{t.previewDisabledTitle}</h4>
               <p>{t.previewDisabledWarning}</p>
             </span>
          ) : (
            <span className="text-slate-500 flex items-center justify-center h-full">
              {t.previewPlaceholder}
            </span>
          )}
        </code>
      </pre>
    </div>
  );
};

export default PreviewPanel;
