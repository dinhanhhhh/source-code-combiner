import React from 'react';
import type { ExportFormat } from '../types';

interface FormatSelectorProps {
  selectedFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  t: {
    formatLabel: string;
    formatTxt: string;
    formatMarkdown: string;
    formatJson: string;
  };
  disabled?: boolean;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
  t,
  disabled = false,
}) => {
  const formats: { value: ExportFormat; label: string }[] = [
    { value: 'txt', label: t.formatTxt },
    { value: 'md', label: t.formatMarkdown },
    { value: 'json', label: t.formatJson },
  ];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-400">{t.formatLabel}:</label>
      <select
        value={selectedFormat}
        onChange={(e) => onFormatChange(e.target.value as ExportFormat)}
        disabled={disabled}
        className="px-3 py-2 bg-slate-700 text-slate-200 text-sm font-medium rounded-md border border-slate-600 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
      >
        {formats.map((format) => (
          <option key={format.value} value={format.value}>
            {format.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormatSelector;
