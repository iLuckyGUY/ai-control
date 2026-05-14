<p align="center">
  <img src="logo.png" alt="AI Control" width="120">
</p>

<h1 align="center">🤖 AI Control</h1>

<p align="center">
  <b>Единый пульт управления компьютером для твоего AI-ассистента</b><br>
  <i>The unified remote control for your AI assistant — terminal, files, Docker, AppleScript, and beyond</i>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-быстрый-старт">Быстрый старт</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-доступные-инструменты">Инструменты</a> •
  <a href="#-clients">Clients</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/macOS-✓-brightgreen" alt="macOS">
  <img src="https://img.shields.io/badge/Linux-✓-brightgreen" alt="Linux">
  <img src="https://img.shields.io/badge/Windows-✓-brightgreen" alt="Windows">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT">
</p>

---

## 📖 О проекте / About

**AI Control** — это MCP-сервер, который даёт вашему AI-ассистенту полный контроль над компьютером: терминал, файлы, Docker, AppleScript, процессы, PDF/Excel/DOCX, поиск по коду и многое другое. Всё что нужно AI чтобы работать как полноценный разработчик — в одном инструменте.

*AI Control is an MCP server that gives your AI assistant full control over your computer — terminal, files, Docker, AppleScript, processes, PDF/Excel/DOCX, code search and more. Everything your AI needs to work like a full-stack developer, in one tool.*

---

### 🔌 Под капотом / Under the Hood

AI Control базируется на коде [Desktop Commander MCP](https://github.com/wonderwhy-er/DesktopCommanderMCP) от Eduards Ruzga и объединяет его с собственными macOS-инструментами. Мы глубоко переработали код, провели ребрендинг, добавили нативные macOS-тулзы (AppleScript, Docker, System Info), почистили зависимости и адаптировали под свой стек.

*AI Control is based on [Desktop Commander MCP](https://github.com/wonderwhy-er/DesktopCommanderMCP) by Eduards Ruzga, merged with our own macOS-native tools. We deeply reworked the code, rebranded, added native macOS tools (AppleScript, Docker, System Info), cleaned up dependencies, and adapted it to our stack.*

---

## ✨ Features

### 🍎 macOS Native
| Feature | Description |
|---------|-------------|
| **AppleScript** | Управляй Finder, открывай приложения, показывай диалоги, автоматизируй GUI |
| **Docker Control** | `docker ps`, `compose up -d`, `restart nginx` — без лишних движений |
| **System Info** | CPU, память, диск, аптайм — реальное состояние системы в реальном времени |
| **Homebrew PATH** | Автоматический поиск инструментов в `/opt/homebrew` |

### 🖥️ Terminal & Processes
| Feature | Description |
|---------|-------------|
| **Smart REPL** | Авто-детект промптов Python, Node.js, R, SSH, баз данных |
| **Process Interaction** | Отправляй команды в запущенные процессы, читай вывод |
| **Output Pagination** | read_process_output с offset/length/tail |
| **Session Management** | list_sessions, force_terminate, kill_process |
| **Timeout & Fallback** | Если Python не найден — запустит Node.js |

### 📁 Filesystem & Documents
| Feature | Description |
|---------|-------------|
| **Read/Write** | Любые текстовые файлы с пагинацией строк |
| **PDF** | Чтение (в markdown), создание из MD, вставка/удаление страниц |
| **Excel** | Чтение, запись, редактирование ячеек (.xlsx, .xls, .xlsm) |
| **DOCX** | Чтение, создание, XML-редактирование |
| **Images** | Просмотр PNG, JPEG, GIF, WebP прямо в чате |
| **Code Search** | ripgrep: поиск по имени файла или содержимому |
| **Edit Block** | Хирургическая замена текста с fuzzy matching |
| **Bulk Read** | Читай несколько файлов одновременно |
| **Directory Tree** | Рекурсивный листинг с защитой от переполнения контекста |

### 🛡️ Security
| Feature | Description |
|---------|-------------|
| **Command Blocklist** | Блокировка опасных команд (sudo, dd, mkfs...) |
| **Bypass Detection** | Отлавливает обход через `$()`, backticks, subshells |
| **Symlink Protection** | Предотвращает directory traversal |
| **Docker Isolation** | Полная песочница через Docker |
| **Config Restrictions** | `allowedDirectories` для файловых операций |
| **Telemetry Opt-Out** | Полный контроль над сбором данных |

---

## 🚀 Быстрый старт / Quick Start

### Установка в Claude Desktop

**Шаг 1.** Установи глобально:
```bash
npm install -g ai-control
```

**Шаг 2.** Добавь в конфиг Claude Desktop.

*Найди файл `claude_desktop_config.json`:*
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

*И добавь этот entry:*
```json
{
  "mcpServers": {
    "ai-control": {
      "command": "ai-control"
    }
  }
}
```

**Шаг 3.** Перезапусти Claude Desktop.

✅ Готово. Теперь Claude может запускать терминал, читать файлы, работать с Docker и AppleScript.

---

## 🔧 Installation

### Prerequisites
- **Node.js** 18+ (скачать: [nodejs.org](https://nodejs.org))
- **Claude Desktop** или любой MCP-клиент

### macOS / Linux / Windows

<details>
<summary><b>💻 Option 1: Глобальная установка (рекомендуется / recommended)</b></summary><br>

```bash
npm install -g ai-control
```

Проверьте:
```bash
ai-control --version
```

**✅ Auto-Updates:** `npm update -g ai-control`

</details>

<details>
<summary><b>📦 Option 2: Локальная установка / Local build</b></summary><br>

```bash
git clone https://github.com/iLuckyGUY/ai-control.git
cd ai-control
npm install
npm run build
npm run link:local
```

**❌ Auto-Updates:** Нет — `git pull && npm run build`

</details>

<details>
<summary><b>🐳 Option 3: Docker (песочница / sandbox)</b></summary><br>

Для полной изоляции от хост-системы:

```json
{
  "mcpServers": {
    "ai-control": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-v", "/Users/username:/mnt/host",
        "mcp/ai-control:latest"
      ]
    }
  }
}
```

**✅ Auto-Updates:** `docker pull mcp/ai-control:latest`

</details>

### 🔄 Обновление / Update
```bash
npm update -g ai-control
```

### 🗑️ Удаление / Uninstall
```bash
npm uninstall -g ai-control
# затем удали entry из claude_desktop_config.json
```

---

## 🛠️ Доступные инструменты / Available Tools

AI Control предоставляет **38+ инструментов** в 6 категориях:

### ⚙️ Configuration
| Tool | Description |
|------|-------------|
| `get_config` | Получить полную конфигурацию сервера |
| `set_config_value` | Изменить любой параметр (blockedCommands, defaultShell, allowedDirectories...) |

### 🍎 macOS Native
| Tool | Description |
|------|-------------|
| `applescript` | Выполнить AppleScript для GUI automation |
| `docker_command` | Docker / Docker Compose команды |
| `system_info` | CPU, память, диск, аптайм в реальном времени |

### 🖥️ Terminal & Processes
| Tool | Description |
|------|-------------|
| `start_process` | Запустить программу/REPL с авто-детектом промпта |
| `interact_with_process` | Отправить команду в запущенный процесс |
| `read_process_output` | Читать вывод с пагинацией (offset/length/tail) |
| `force_terminate` | Принудительно завершить сессию |
| `list_sessions` | Список всех активных терминальных сессий |
| `list_processes` | Список всех процессов ОС |
| `kill_process` | Завершить процесс по PID |

### 📁 Filesystem
| Tool | Description |
|------|-------------|
| `read_file` | Читать текст, PDF, Excel, DOCX, изображения (с пагинацией) |
| `read_multiple_files` | Читать несколько файлов сразу |
| `write_file` | Писать/дописывать файлы |
| `write_pdf` | Создавать и модифицировать PDF |
| `create_directory` | Создать директорию (рекурсивно) |
| `list_directory` | Листинг с рекурсией (depth) |
| `move_file` | Переместить/переименовать |
| `get_file_info` | Метаданные файла (размер, даты, права, строки) |
| `start_search` | Поиск файлов или контента через ripgrep |
| `get_more_search_results` | Дозагрузка результатов поиска |
| `stop_search` | Остановить активный поиск |
| `list_searches` | Список активных поисков |

### ✏️ Editing
| Tool | Description |
|------|-------------|
| `edit_block` | Хирургическая замена текста с fuzzy matching. Замена ячеек в Excel |

### 📊 Analytics
| Tool | Description |
|------|-------------|
| `get_usage_stats` | Статистика использования |
| `get_recent_tool_calls` | История вызовов (восстановление контекста) |
| `give_feedback` | Форма обратной связи |
| `get_prompts` | Онбординг-промпты для новых пользователей |

---

## 🎮 Клиенты / Clients

AI Control работает с любым MCP-совместимым клиентом:

<details>
<summary><b>Claude Desktop</b></summary><br>

```json
{
  "mcpServers": {
    "ai-control": {
      "command": "ai-control"
    }
  }
}
```
</details>

<details>
<summary><b>Cursor</b></summary><br>

Добавь в `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "ai-control": {
      "command": "npx",
      "args": ["-y", "ai-control"]
    }
  }
}
```
</details>

<details>
<summary><b>VS Code / GitHub Copilot</b></summary><br>

В `.vscode/mcp.json`:
```json
{
  "mcpServers": {
    "ai-control": {
      "command": "npx",
      "args": ["-y", "ai-control"]
    }
  }
}
```
</details>

<details>
<summary><b>Claude Code (CLI)</b></summary><br>

```bash
claude mcp add --scope user ai-control -- npx -y ai-control
```
</details>

<details>
<summary><b>Windsurf</b></summary><br>

В `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "ai-control": {
      "command": "npx",
      "args": ["-y", "ai-control"]
    }
  }
}
```
</details>

<details>
<summary><b>Cline / Roo Code / Trae / Kiro</b></summary><br>

Добавь MCP server с конфигом:
```json
{
  "mcpServers": {
    "ai-control": {
      "command": "npx",
      "args": ["-y", "ai-control"]
    }
  }
}
```
</details>

<details>
<summary><b>JetBrains AI Assistant</b></summary><br>

`Settings → Tools → AI Assistant → MCP` → + Add → As JSON → вставь конфиг.
</details>

<details>
<summary><b>Gemini CLI</b></summary><br>

В `~/.gemini/settings.json`:
```json
{
  "mcpServers": {
    "ai-control": {
      "command": "npx",
      "args": ["-y", "ai-control"]
    }
  }
}
```
</details>

<details>
<summary><b>OpenAI Codex</b></summary><br>

```bash
codex mcp add ai-control -- npx -y ai-control
```
</details>

---

## 💡 Примеры / Examples

### 📊 Анализ данных / Data Analysis
```
"Проанализируй sales.csv и покажи топ клиентов"
→ Claude запускает Python REPL, загружает pandas в память,
  считает статистику и возвращает результат
```

### 🐳 Docker
```
"Перезапусти nginx и покажи логи"
→ docker_command("restart nginx")
→ docker_command("logs nginx --tail 50")
```

### 🍎 AppleScript automation
```
"Создай папку Reports на рабочем столе и открой её"
→ applescript('tell app "Finder" to make new folder...')
```

### 🖥️ Системная диагностика / System Health
```
"Проверь состояние системы"
→ system_info → CPU, uptime, память, диск
```

### 📄 Работа с документами / Documents
```
"Создай PDF-отчёт из этого markdown"
→ write_pdf(path="report.pdf", content="# Отчёт...")
```

---

## 🔧 Конфигурация / Configuration

```javascript
// Посмотреть конфиг
get_config({})

// Сменить shell
set_config_value({ key: "defaultShell", value: "/bin/zsh" })

// Заблокировать команды
set_config_value({ key: "blockedCommands", value: ["sudo", "dd", "mkfs"] })

// Ограничить файловую систему
set_config_value({ key: "allowedDirectories", value: ["/Users/user/projects"] })

// Лимит строк для чтения
set_config_value({ key: "fileReadLineLimit", value: 1000 })

// Отключить телеметрию
set_config_value({ key: "telemetryEnabled", value: false })
```

---

## 🔒 Privacy & Telemetry

AI Control собирает минимальную псевдонимную телеметрию — только метаданные использования, без содержимого файлов, путей или аргументов команд.

*AI Control collects minimal pseudonymous telemetry — usage metadata only. No file contents, paths, or command arguments are collected.*

**Отключить / Opt-out:** `set_config_value({ key: "telemetryEnabled", value: false })`

---

## 🆘 FAQ

<details>
<summary><b>Нужен ли Node.js? / Do I need Node.js?</b></summary>
Да, версия 18+. Если нет — установи с [nodejs.org](https://nodejs.org). *Yes, version 18+. Download from [nodejs.org](https://nodejs.org).*
</details>

<details>
<summary><b>Нужен ли API-ключ? / Do I need an API key?</b></summary>
Нет. AI Control работает с подпиской Claude Pro ($20/мес), не с API. *No. AI Control works with Claude Pro subscription, not API tokens.*
</details>

<details>
<summary><b>Работает ли на Windows и Linux? / Does it work on Windows and Linux?</b></summary>
Да. macOS-фичи (AppleScript, system_info через vm_stat) доступны только на Mac, но всё остальное — терминал, файлы, поиск, процессы — на всех платформах. *Yes. macOS-specific features work on Mac only, but everything else works everywhere.*
</details>

<details>
<summary><b>Как обновить? / How to update?</b></summary>
`npm update -g ai-control` и перезапусти клиент. *Then restart your client.*
</details>

<details>
<summary><b>AI Control vs Desktop Commander?</b></summary>
AI Control — форк [Desktop Commander MCP](https://github.com/wonderwhy-er/DesktopCommanderMCP), объединённый с собственными macOS-инструментами. Код переработан, произведён ребрендинг, добавлены AppleScript, Docker, System Info, обновлена документация. *AI Control is a fork of Desktop Commander MCP merged with our own macOS tools. Rebranded, cleaned up, with added AppleScript/Docker/System Info tools.*
</details>

---

## 🧑‍💻 Contributing

PR приветствуются! Форкай, делай ветку, открывай PR.

Темы: новые тулзы, поддержка платформ, баг-фиксы, тесты, документация.

---

## 📄 License

MIT © [luckyguy](https://github.com/iLuckyGUY)

*Основано на [Desktop Commander MCP](https://github.com/wonderwhy-er/DesktopCommanderMCP) © Eduards Ruzga / MIT*

---

**Developed with ❤️ by:**
- [luckyguy](https://github.com/iLuckyGUY) — идея, архитектура, macOS-инструменты, DevOps
- [OpenCode](https://opencode.ai) — код, рефакторинг, документация, поддержка
