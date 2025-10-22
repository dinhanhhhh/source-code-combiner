import React from 'react';
import { CopyIcon, DownloadIcon } from './icons';

interface ActionButtonsProps {
  onCopyToClipboard: () => void;
  onDownload: () => void;
  combinedContent: string;
  copySuccess: string;
  t: any; // Type for translations object
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCopyToClipboard,
  onDownload,
  combinedContent,
  copySuccess,
  t,
}) => (
  <>
    {copySuccess && (
      <span className="text-sm text-green-400 animate-fade-in">
        {copySuccess}
      </span>
    )}
    <button
      onClick={onCopyToClipboard}
      disabled={!combinedContent}
      title={t.copyTooltip}
      className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-slate-200 text-sm font-medium rounded-md hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
    >
      <CopyIcon className="w-5 h-5" />
    </button>
    <button
      onClick={onDownload}
      disabled={!combinedContent}
      className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-md hover:bg-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
    >
      <DownloadIcon className="w-5 h-5" />
      {t.download}
    </button>
  </>
);

export default ActionButtons;
