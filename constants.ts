// Limit for in-browser preview to prevent crashes, set to 50MB
export const PREVIEW_SIZE_LIMIT = 50 * 1024 * 1024;

export const TECH_MARKERS: Record<string, string[]> = {
  // Frameworks/Libraries
  "React": ["next.config.js", ".jsx", ".tsx", "react-dom"],
  "Vue": ["vue.config.js", "nuxt.config.js", ".vue"],
  "Svelte": ["svelte.config.js", ".svelte"],
  "Angular": ["angular.json"],
  // Languages
  "TypeScript": ["tsconfig.json", ".ts", ".tsx"],
  "JavaScript": [".js", ".jsx", ".mjs", ".cjs"],
  "Python": ["requirements.txt", "pyproject.toml", "Pipfile", "setup.py", ".py"],
  "Java": ["pom.xml", "build.gradle", "settings.gradle", ".java"],
  "Go": ["go.mod", "go.sum", ".go"],
  "Rust": ["Cargo.toml", ".rs"],
  "Ruby": ["Gemfile", ".rb"],
  "Terraform": [".tf", ".tf.json"],
  // General Environment
  "Node.js": ["package.json", "vite.config.ts", "tailwind.config.js"],
};


export const TECH_WHITELIST: Record<string, string[]> = {
  "Common": ['.md', '.txt', '.json', '.yml', '.yaml', '.toml', '.xml', '.html', 'license', 'dockerfile', 'readme'],
  "Node.js": ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.less', '.mjs', '.cjs', '.npmrc'],
  "React": ['.js', '.jsx', '.ts', '.tsx'],
  "Vue": ['.vue', '.js', '.ts'],
  "Svelte": ['.svelte', '.js', 'ts'],
  "Angular": ['.ts', '.html', '.css', '.scss'],
  "TypeScript": ['.ts', '.tsx'],
  "JavaScript": ['.js', '.jsx', '.mjs', '.cjs'],
  "Python": ['.py', '.ipynb', 'requirements.txt', 'pipfile'],
  "Java": ['.java', '.properties', '.gradle', '.xml'],
  "Go": ['.go'],
  "Rust": ['.rs'],
  "Ruby": ['.rb'],
  "Terraform": [".tf", ".tf.json"],
  "Unknown": ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.rs', '.rb', '.css', '.scss', '.html'],
};


export const DEFAULT_IGNORE_PATTERNS = `
# Dependencies & environments
node_modules/
vendor/
venv/
env/
.venv/
.env/
__pycache__/
.cache/
.mypy_cache/
.ruff_cache/
.pytest_cache/
pip-wheel-metadata/
site-packages/
deps/
packages/
.tox/

# Sensitive files handled by sensitive check
.env
.env.*
*.env

# Build artifacts
dist/
build/
target/
out/
bin/
obj/
.eggs/
lib64/
generated/

# Framework build folders
.next/
.nuxt/
.angular/
coverage/
.turbo/
.vercel/
.expo/
.parcel-cache/

# Version control, IDE & CI/CD
.git/
.svn/
.hg/
.idea/
.vscode/
.vscode-test/
.vs/
.history/
.github/
.gitlab/
.circleci/

# Docker & containers
.docker/
docker/
containers/

# Temp & OS
temp/
tmp/
.tmp/
.DS_Store
__MACOSX/
Thumbs.db
desktop.ini
ehthumbs.db
System Volume Information/

# Logs
logs/
log/
*.log
*.log.*
*.out

# Lock files
package-lock.json
yarn.lock
pnpm-lock.yaml
composer.lock
poetry.lock
Cargo.lock

# Compiled/intermediate
*.pyc
*.pyo
*.pyd
*.class
*.o
*.so
*.dll
*.exe
*.dylib
*.a

# Media
*.jpg
*.jpeg
*.png
*.gif
*.svg
*.ico
*.webp
*.mp3
*.wav
*.flac
*.ogg
*.mp4
*.avi
*.mov
*.mkv

# Fonts
*.ttf
*.otf
*.woff
*.woff2

# Archives
*.zip
*.tar
*.gz
*.rar
*.7z
*.bz2
*.xz
*.lz
*.lzma

# Documents
*.pdf
*.docx
*.doc
*.ppt
*.pptx
*.xls
*.xlsx
*.csv

# Databases & sessions
db/
database/
sqlite/
sessions/
flask_session/
instance/

# Misc
source_dump.txt
*.bak
*.swp
*.swo
`.trim();

export const SENSITIVE_PATTERNS = {
  fileNames: ['.env', '.env.local', 'credentials.json', 'id_rsa', 'id_dsa', 'settings.json', 'secret_token.txt'],
  keywords: ['API_KEY', 'SECRET_KEY', 'ACCESS_TOKEN', 'PRIVATE_KEY', 'PASSWORD', 'client_secret', 'api_key', 'secret_key']
};