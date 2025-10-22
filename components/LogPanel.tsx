import React from 'react';

interface LogPanelProps {
  logs: string[];
  t: any;
  logContainerRef: React.RefObject<HTMLDivElement>;
}

const LogPanel: React.FC<LogPanelProps> = ({ logs, t, logContainerRef }) => {
  return (
    <div className="flex-grow flex flex-col min-h-0">
      <h3 className="text-lg font-semibold text-white mb-2">
        {t.logs.title}
      </h3>
      <div
        ref={logContainerRef}
        className="flex-grow overflow-y-auto p-3 bg-slate-900/50 rounded-lg border border-slate-700 min-h-[10rem] max-h-60 text-xs text-slate-400 font-mono"
      >
        {logs.length > 0 ? (
          logs.map((log, i) => <p key={i}>{log}</p>)
        ) : (
          <p>{t.logs.waiting}</p>
        )}
      </div>
    </div>
  );
};

export default LogPanel;
