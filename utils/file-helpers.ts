import type { SelectedFile } from "../types";
import { DEFAULT_IGNORE_PATTERNS } from "../constants";

/* =========================
   Helpers
   ========================= */
export function buildIgnoreSets() {
  const lines = DEFAULT_IGNORE_PATTERNS
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  const dirSet = new Set<string>();
  const exactFileSet = new Set<string>();
  const suffixes: string[] = [];

  for (const p of lines) {
    if (p.endsWith("/")) {
      dirSet.add(p.slice(0, -1).toLowerCase());
    } else if (p.startsWith("*.")) {
      suffixes.push(p.slice(1).toLowerCase()); // ".log", ".png", ...
    } else {
      exactFileSet.add(p.toLowerCase());
    }
  }
  return { dirSet, exactFileSet, suffixes };
}

function normalizeAndSplitPath(filePath: string): {
  segments: string[];
  base: string;
} {
  const normalized = filePath.replace(/\\/g, "/");
  const segments = normalized
    .split("/")
    .map((s) => s.toLowerCase())
    .filter(Boolean);
  const base = segments.length
    ? segments[segments.length - 1]
    : segments.pop()!;
  return { segments, base };
}

export function isIgnoredPath(
  filePath: string,
  sets: ReturnType<typeof buildIgnoreSets>
): boolean {
  const { dirSet, exactFileSet, suffixes } = sets;
  const { segments, base } = normalizeAndSplitPath(filePath);

  for (const seg of segments) {
    if (dirSet.has(seg)) return true;
  }
  if (exactFileSet.has(base)) return true;
  for (const suf of suffixes) {
    if (base.endsWith(suf)) return true;
  }
  return false;
}

export const isWhitelisted = (filePath: string, whitelist: Set<string>): boolean => {
  const lowerPath = filePath.toLowerCase();
  const base = lowerPath.split('/').pop() || '';
  
  if (whitelist.has(base)) return true;
  
  for (const ext of whitelist) {
    if (ext.startsWith('.') && lowerPath.endsWith(ext)) {
      return true;
    }
  }
  
  return false;
}

interface TreeNode {
  [key: string]: TreeNode;
}

export function generateDirectoryTree(files: SelectedFile[]): string {
  if (files.length === 0) return "";

  const root: TreeNode = {};
  const ensureChild = (node: TreeNode, key: string): TreeNode => {
    if (!node[key]) node[key] = {};
    return node[key];
  };

  for (const f of files) {
    const parts = f.name.split("/").filter(Boolean);
    let cur = root;
    for (const part of parts) {
      cur = ensureChild(cur, part);
    }
  }

  const BOX = {
    branch: "├── ",
    last: "└── ",
    pipe: "│   ",
    space: "    ",
  } as const;

  const draw = (node: TreeNode, prefix = ""): string => {
    const entries = Object.entries(node);
    let out = "";
    entries.forEach(([name, sub], i) => {
      const isLast = i === entries.length - 1;
      const connector = isLast ? BOX.last : BOX.branch;
      out += `${prefix}${connector}${name}\n`;
      if (Object.keys(sub).length > 0) {
        const newPrefix = prefix + (isLast ? BOX.space : BOX.pipe);
        out += draw(sub, newPrefix);
      }
    });
    return out;
  };
  const top = Object.keys(root);
  if (top.length === 1) {
    return `${top[0]}\n${draw(root[top[0]], "")}`;
  }
  return draw(root);
}
