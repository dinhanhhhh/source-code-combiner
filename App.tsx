
import React, { useState, useCallback, useEffect, useRef } from "react";
import type { SelectedFile } from "./types";
import { translations } from "./i18n";
import { PREVIEW_SIZE_LIMIT, TECH_MARKERS, TECH_WHITELIST, SENSITIVE_PATTERNS } from "./constants";
import { useMediaQuery } from "./hooks/useMediaQuery";
import {
  buildIgnoreSets,
  isIgnoredPath,
  isWhitelisted,
  generateDirectoryTree,
} from "./utils/file-helpers";

import Header from "./components/Header";
import ConfigurePanel from "./components/ConfigurePanel";
import PreviewPanel from "./components/PreviewPanel";
import TabButton from "./components/TabButton";
import ActionButtons from "./components/ActionButtons";
import { formatBytes } from "./utils/format";

type Language = "vi" | "en";

const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [whitelistedOutFiles, setWhitelistedOutFiles] = useState<
    SelectedFile[]
  >([]);
  const [sensitiveFiles, setSensitiveFiles] = useState<SelectedFile[]>([]);
  const [combinedContent, setCombinedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<string>("");
  const [language, setLanguage] = useState<Language>("vi");
  const [logs, setLogs] = useState<string[]>([]);
  const [rootDirectoryName, setRootDirectoryName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"configure" | "preview">(
    "configure"
  );
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const logContainerRef = useRef<HTMLDivElement>(null);

  const t = translations[language];
  const addLog = useCallback(
    (m: string) =>
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${m}`]),
    []
  );

  useEffect(() => {
    if (combinedContent && !isDesktop && activeTab === 'configure') setActiveTab("preview");
    if (selectedFiles.length === 0 && !isDesktop) setActiveTab("configure");
  }, [combinedContent, selectedFiles.length, isDesktop, activeTab]);

  const ignoreSets = React.useMemo(
    () => buildIgnoreSets(),
    []
  );
  
  const generatePreviewContent = useCallback(async (filesToProcess: SelectedFile[]) => {
    if (filesToProcess.length === 0) {
      setCombinedContent("");
      return;
    }
    setIsLoading(true);
    addLog(t.logs.generatingTree);
    const tree = generateDirectoryTree(filesToProcess);

    addLog(t.logs.combiningContent);
    const fileContents = await Promise.all(
      filesToProcess.map(f => f.file.text().catch(e => `Error reading ${f.name}: ${e.message}`))
    );

    const content = filesToProcess
      .map((f, i) => {
        const header = `// START OF FILE: ${f.name}`;
        const footer = `// END OF FILE: ${f.name}\n\n`;
        return `${header}\n\n${fileContents[i]}\n\n${footer}`;
      })
      .join("");

    const finalContent = `${t.outputHeader}\n\n${tree}\n\n${"=".repeat(
      80
    )}\n\n${content}`;
    setCombinedContent(finalContent);
    addLog(t.logs.combinationComplete);

    const fileCount = filesToProcess.length;
    const size = formatBytes(finalContent.length); 
    const lines = finalContent.split('\n').length;
    addLog(t.logs.stats(fileCount, size, lines));

    setIsLoading(false);
  }, [addLog, t.logs, t.outputHeader]);

  useEffect(() => {
    const totalSize = selectedFiles.reduce((acc, f) => acc + f.size, 0);
    if (selectedFiles.length > 0 && totalSize < PREVIEW_SIZE_LIMIT) {
      generatePreviewContent(selectedFiles);
    } else {
      setCombinedContent("");
    }
  }, [selectedFiles, generatePreviewContent]);

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      setIsLoading(true);
      addLog(t.logs.readingFiles);

      if (selectedFiles.length === 0 && files.length > 0) {
        const firstFile = files[0] as File & { webkitRelativePath?: string };
        const path = firstFile.webkitRelativePath || firstFile.name;
        const pathParts = path.split('/');
        setRootDirectoryName(pathParts.length > 1 ? pathParts[0] : "project");
      }

      const blacklistedFiles: SelectedFile[] = [];
      for (const file of files) {
        const fileWithWRP = file as File & { webkitRelativePath?: string };
        const filePath =
          fileWithWRP.webkitRelativePath &&
          fileWithWRP.webkitRelativePath.length > 0
            ? fileWithWRP.webkitRelativePath
            : file.name;

        if (!isIgnoredPath(filePath, ignoreSets)) {
          blacklistedFiles.push({ name: filePath, file, size: file.size });
        }
      }
      const initialCount = files.length;
      const blacklistedCount = initialCount - blacklistedFiles.length;
      addLog(t.logs.filesRead(blacklistedFiles.length, initialCount));

      // Security: Check for sensitive files
      addLog(t.logs.checkingSensitive);
      const sensitiveFileNames = new Set(SENSITIVE_PATTERNS.fileNames.map(f => f.toLowerCase()));
      const sensitiveKeywords = SENSITIVE_PATTERNS.keywords;
      
      const filesForProcessing: SelectedFile[] = [];
      const detectedSensitiveFiles: SelectedFile[] = [];
      
      for (const file of blacklistedFiles) {
        let isSensitive = false;
        if (sensitiveFileNames.has(file.name.split('/').pop()!.toLowerCase())) {
          isSensitive = true;
        }
      
        if (!isSensitive && file.size < 1024 * 1024) { // Only check content of files < 1MB
          try {
            const content = await file.file.text();
            if (sensitiveKeywords.some(keyword => content.includes(keyword))) {
              isSensitive = true;
            }
          } catch (e) { /* Ignore content check for binary files */ }
        }
        
        if (isSensitive) {
          detectedSensitiveFiles.push(file);
        } else {
          filesForProcessing.push(file);
        }
      }
      
      if (detectedSensitiveFiles.length > 0) {
        addLog(t.logs.sensitiveFileWarning(detectedSensitiveFiles.length));
        setSensitiveFiles(prev => {
          const existing = new Set(prev.map(f => f.name));
          const uniqueNew = detectedSensitiveFiles.filter(f => !existing.has(f.name));
          return [...prev, ...uniqueNew].sort((a, b) => a.name.localeCompare(b.name));
        });
      }

      // Continue with non-sensitive files
      const techScores: Record<string, number> = {};
      for (const file of filesForProcessing) {
        if (file.name.endsWith('package.json')) {
            try {
                const content = await file.file.text();
                const pkg = JSON.parse(content);
                const allDeps = {...(pkg.dependencies || {}), ...(pkg.devDependencies || {})};
                if (allDeps.react) techScores["React"] = (techScores["React"] || 0) + 5;
                if (allDeps.vue) techScores["Vue"] = (techScores["Vue"] || 0) + 5;
                if (allDeps.svelte) techScores["Svelte"] = (techScores["Svelte"] || 0) + 5;
                if (allDeps.angular) techScores["Angular"] = (techScores["Angular"] || 0) + 5;
                if (allDeps.typescript) techScores["TypeScript"] = (techScores["TypeScript"] || 0) + 5;
            } catch (e) {
                console.error("Error parsing package.json", e);
            }
        }

        for (const techKey in TECH_MARKERS) {
            const markers = TECH_MARKERS[techKey];
            const lowerFileName = file.name.toLowerCase();
            if (markers.some(marker => lowerFileName.includes(marker))) {
                techScores[techKey] = (techScores[techKey] || 0) + 1;
            }
        }
      }
      
      let detectedTechs = Object.entries(techScores)
        .filter(([, score]) => score > 0)
        .sort((a, b) => b[1] - a[1]) 
        .map(([tech]) => tech);

      if (detectedTechs.includes('React') || detectedTechs.includes('Vue') || detectedTechs.includes('Svelte') || detectedTechs.includes('Angular')) {
          detectedTechs = detectedTechs.filter(t => t !== 'Node.js');
      }
      if(detectedTechs.length === 0) detectedTechs.push("Unknown");

      const tech = detectedTechs.join(', ');
      addLog(t.logs.techDetected(tech));
      
      const whitelistSet = new Set(TECH_WHITELIST["Common"]);
      const finalDetected = detectedTechs.length > 0 && !detectedTechs.includes("Unknown") ? detectedTechs : ["Unknown"];

      finalDetected.forEach(detectedTech => {
          if (TECH_WHITELIST[detectedTech]) {
            TECH_WHITELIST[detectedTech].forEach(ext => whitelistSet.add(ext));
          }
      });
       if (detectedTechs.some(t => ['React', 'Vue', 'Svelte', 'Angular', 'Node.js', 'TypeScript', 'JavaScript'].includes(t))) {
          TECH_WHITELIST["Node.js"].forEach(ext => whitelistSet.add(ext));
      }
      
      const extensions = Array.from(whitelistSet).filter(e => e.startsWith('.')).sort().join(', ');
      addLog(t.logs.extensionsIncluded(extensions));

      const filesToKeep: SelectedFile[] = [];
      const filesToExclude: SelectedFile[] = [];

      for (const file of filesForProcessing) {
        if (isWhitelisted(file.name, whitelistSet)) {
          filesToKeep.push(file);
        } else {
          filesToExclude.push(file);
        }
      }
      
      const whitelistedCount = filesToExclude.length;
      addLog(t.logs.filterCounts(blacklistedCount, whitelistedCount));
      addLog(t.logs.finalFileCount(filesToKeep.length));

      setSelectedFiles(prev => {
          const existing = new Set(prev.map(f => f.name));
          const uniqueNew = filesToKeep.filter(f => !existing.has(f.name));
          return [...prev, ...uniqueNew].sort((a,b) => a.name.localeCompare(b.name));
      });
      setWhitelistedOutFiles(prev => {
          const existing = new Set(prev.map(f => f.name));
          const uniqueNew = filesToExclude.filter(f => !existing.has(f.name));
          return [...prev, ...uniqueNew].sort((a,b) => a.name.localeCompare(b.name));
      });
      
      setIsLoading(false);
    },
    [ignoreSets, t.logs, addLog, selectedFiles.length]
  );

  const handleRemoveFile = useCallback(
    (fileName: string) => {
      setSelectedFiles((prev) => prev.filter((f) => f.name !== fileName));
      addLog(t.logs.fileRemoved(fileName));
    },
    [t.logs, addLog]
  );

  const handleIncludeFile = useCallback((fileName: string) => {
    const fileToInclude = whitelistedOutFiles.find(f => f.name === fileName);
    if (fileToInclude) {
      setWhitelistedOutFiles(prev => prev.filter(f => f.name !== fileName));
      setSelectedFiles(prev => [...prev, fileToInclude].sort((a,b) => a.name.localeCompare(b.name)));
      addLog(t.logs.fileReincluded(fileName));
    }
  }, [whitelistedOutFiles, t.logs, addLog]);

  const handleIncludeSensitiveFile = useCallback((fileName: string) => {
    const fileToInclude = sensitiveFiles.find(f => f.name === fileName);
    if (fileToInclude) {
      setSensitiveFiles(prev => prev.filter(f => f.name !== fileName));
      setSelectedFiles(prev => [...prev, fileToInclude].sort((a,b) => a.name.localeCompare(b.name)));
      addLog(t.logs.fileReincluded(fileName));
    }
  }, [sensitiveFiles, t.logs, addLog]);


  const handleClearAll = useCallback(() => {
    setSelectedFiles([]);
    setWhitelistedOutFiles([]);
    setSensitiveFiles([]);
    setCombinedContent("");
    setLogs([]);
    setRootDirectoryName("");
    addLog(t.logs.cleared);
  }, [addLog, t.logs]);

  const handleCombineAndDownload = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    setIsLoading(true);
    addLog(t.logs.savingStarted);
    addLog(t.logs.generatingTree);
    const tree = generateDirectoryTree(selectedFiles);
    addLog(t.logs.combiningContent);

    const parts: string[] = [];
    const header = `${t.outputHeader}\n\n${tree}\n\n${"=".repeat(80)}\n\n`;
    parts.push(header);

    for (const f of selectedFiles) {
      addLog(t.logs.savingFile(f.name));
      const fileHeader = `// START OF FILE: ${f.name}\n\n`;
      const fileFooter = `\n\n// END OF FILE: ${f.name}\n\n`;
      
      parts.push(fileHeader);
      try {
        const content = await f.file.text();
        parts.push(content);
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        parts.push(`Error reading file: ${errorMsg}`);
      }
      parts.push(fileFooter);
    }
    
    const blob = new window.Blob(parts, { type: "text/plain;charset=utf-8" });
    const contentForLineCount = parts.join('');
    const lines = contentForLineCount.split('\n').length;
    const fileCount = selectedFiles.length;
    const size = formatBytes(blob.size);
    addLog(t.logs.stats(fileCount, size, lines));

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rootDirectoryName || "all"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog(t.logs.downloaded);
    setIsLoading(false);
  }, [selectedFiles, addLog, t.logs, t.outputHeader, rootDirectoryName]);

  const handleDownload = useCallback(() => {
    if (!combinedContent) return;
    const blob = new window.Blob([combinedContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rootDirectoryName || "all"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog(t.logs.downloaded);
  }, [combinedContent, addLog, t.logs, rootDirectoryName]);

  const handleCopyToClipboard = useCallback(() => {
    if (!combinedContent) return;
    navigator.clipboard.writeText(combinedContent).then(
      () => {
        setCopySuccess(t.copySuccess);
        setTimeout(() => setCopySuccess(""), 2000);
        addLog(t.logs.copied);
      },
      () => {
        setCopySuccess(t.copyFail);
        setTimeout(() => setCopySuccess(""), 2000);
      }
    );
  }, [combinedContent, addLog, t.logs, t.copyFail, t.copySuccess]);

  const totalSize = selectedFiles.reduce((acc, f) => acc + f.size, 0);
  const isLargeProject = totalSize >= PREVIEW_SIZE_LIMIT;

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <Header t={t} language={language} setLanguage={setLanguage} />

        <main>
          {isDesktop ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col space-y-4">
                <h2 className="text-xl font-semibold text-white">{t.step1}</h2>
                <ConfigurePanel
                  t={t}
                  isLoading={isLoading}
                  onFilesSelected={handleFilesSelected}
                  selectedFiles={selectedFiles}
                  whitelistedOutFiles={whitelistedOutFiles}
                  sensitiveFiles={sensitiveFiles}
                  onClearAll={handleClearAll}
                  onRemoveFile={handleRemoveFile}
                  onIncludeFile={handleIncludeFile}
                  onIncludeSensitiveFile={handleIncludeSensitiveFile}
                  isLargeProject={isLargeProject}
                  onCombineAndDownload={handleCombineAndDownload}
                  logs={logs}
                  logContainerRef={logContainerRef}
                />
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">{t.step2}</h2>
                  <div className="flex items-center space-x-2">
                    <ActionButtons
                      t={t}
                      combinedContent={combinedContent}
                      copySuccess={copySuccess}
                      onCopyToClipboard={handleCopyToClipboard}
                      onDownload={handleDownload}
                    />
                  </div>
                </div>
                <PreviewPanel
                  t={t}
                  isLoading={isLoading}
                  combinedContent={combinedContent}
                  isLargeProject={isLargeProject}
                  selectedFiles={selectedFiles}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex border-b border-slate-700 sticky top-0 bg-slate-900 z-10">
                <TabButton
                  label={t.step1}
                  isActive={activeTab === "configure"}
                  onClick={() => setActiveTab("configure")}
                />
                <TabButton
                  label={t.step2}
                  isActive={activeTab === "preview"}
                  onClick={() => setActiveTab("preview")}
                  disabled={selectedFiles.length === 0}
                />
              </div>

              {activeTab === "configure" && (
                <div className="bg-slate-800/50 p-6 rounded-b-xl border-x border-b border-slate-700 flex flex-col space-y-4 mt-[-1px]">
                  <ConfigurePanel
                    t={t}
                    isLoading={isLoading}
                    onFilesSelected={handleFilesSelected}
                    selectedFiles={selectedFiles}
                    whitelistedOutFiles={whitelistedOutFiles}
                    sensitiveFiles={sensitiveFiles}
                    onClearAll={handleClearAll}
                    onRemoveFile={handleRemoveFile}
                    onIncludeFile={handleIncludeFile}
                    onIncludeSensitiveFile={handleIncludeSensitiveFile}
                    isLargeProject={isLargeProject}
                    onCombineAndDownload={handleCombineAndDownload}
                    logs={logs}
                    logContainerRef={logContainerRef}
                  />
                </div>
              )}

              {activeTab === "preview" && (
                <div className="bg-slate-800/50 p-6 rounded-b-xl border-x border-b border-slate-700 flex flex-col min-h-[75vh] mt-[-1px]">
                  <PreviewPanel
                    t={t}
                    isLoading={isLoading}
                    combinedContent={combinedContent}
                    isLargeProject={isLargeProject}
                    selectedFiles={selectedFiles}
                  />
                </div>
              )}
            </div>
          )}
        </main>

        {!isDesktop && activeTab === "preview" && combinedContent && (
          <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700 p-4 flex justify-end items-center gap-3 z-50 shadow-lg">
            <ActionButtons
              t={t}
              combinedContent={combinedContent}
              copySuccess={copySuccess}
              onCopyToClipboard={handleCopyToClipboard}
              onDownload={handleDownload}
            />
          </div>
        )}

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>{t.footer}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
