import type { SelectedFile, ExportFormat } from '../types';
import { generateDirectoryTree } from './file-helpers';

/**
 * Get file extension based on export format
 */
export function getFileExtension(format: ExportFormat): string {
  const extensions: Record<ExportFormat, string> = {
    txt: '.txt',
    md: '.md',
    json: '.json',
  };
  return extensions[format];
}

/**
 * Get MIME type based on export format
 */
export function getMimeType(format: ExportFormat): string {
  const mimeTypes: Record<ExportFormat, string> = {
    txt: 'text/plain;charset=utf-8',
    md: 'text/markdown;charset=utf-8',
    json: 'application/json;charset=utf-8',
  };
  return mimeTypes[format];
}

/**
 * Get language identifier for syntax highlighting based on file extension
 */
function getLanguageFromPath(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    py: 'python',
    java: 'java',
    go: 'go',
    rs: 'rust',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    md: 'markdown',
    sql: 'sql',
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    dockerfile: 'dockerfile',
    vue: 'vue',
    svelte: 'svelte',
  };
  return languageMap[ext] || '';
}

/**
 * Format content as TXT (original format)
 */
export function formatAsTxt(
  files: SelectedFile[],
  fileContents: string[],
  tree: string,
  outputHeader: string
): string {
  const content = files
    .map((f, i) => {
      const header = `// START OF FILE: ${f.name}`;
      const footer = `// END OF FILE: ${f.name}\n\n`;
      return `${header}\n\n${fileContents[i]}\n\n${footer}`;
    })
    .join('');

  return `${outputHeader}\n\n${tree}\n\n${'='.repeat(80)}\n\n${content}`;
}

/**
 * Format content as Markdown with syntax highlighting
 */
export function formatAsMarkdown(
  files: SelectedFile[],
  fileContents: string[],
  tree: string,
  projectName: string
): string {
  const parts: string[] = [];
  
  // Header
  parts.push(`# Project: ${projectName}\n`);
  parts.push(`## Directory Tree\n`);
  parts.push('```');
  parts.push(tree);
  parts.push('```\n');
  parts.push('---\n');

  // Files
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const content = fileContents[i];
    const lang = getLanguageFromPath(file.name);
    
    parts.push(`## File: ${file.name}\n`);
    parts.push(`\`\`\`${lang}`);
    parts.push(content);
    parts.push('```\n');
  }

  return parts.join('\n');
}

/**
 * Format content as JSON
 */
export function formatAsJson(
  files: SelectedFile[],
  fileContents: string[],
  tree: string,
  projectName: string
): string {
  const exportData = {
    projectName,
    exportedAt: new Date().toISOString(),
    tree,
    totalFiles: files.length,
    files: files.map((f, i) => ({
      path: f.name,
      size: f.size,
      content: fileContents[i],
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Format content based on selected format
 */
export function formatContent(
  format: ExportFormat,
  files: SelectedFile[],
  fileContents: string[],
  tree: string,
  projectName: string,
  outputHeader: string
): string {
  switch (format) {
    case 'md':
      return formatAsMarkdown(files, fileContents, tree, projectName);
    case 'json':
      return formatAsJson(files, fileContents, tree, projectName);
    case 'txt':
    default:
      return formatAsTxt(files, fileContents, tree, outputHeader);
  }
}
