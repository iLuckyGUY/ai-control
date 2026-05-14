---
name: ai-control-overview
description: Use for AI Control MCP capabilities — persistent shells and REPLs, long-running processes, filesystem beyond the workspace, structured files (.xlsx, .docx, .pdf, images) and large local data files such as CSVs, ripgrep search at scale, SSH, or cross-turn state.
version: 0.1.0
audience: agent
---

# AI Control MCP

AI Control gives the agent reach across the user's actual computer — files, folders, terminals, processes, structured documents, and remote machines reachable over SSH. The tools' detailed schemas (parameters, return shapes, format-specific behavior) live in the MCP itself; this skill explains what they enable and how they compose into common workflows.

## What this MCP gives the agent

**Persistent shell sessions.** AI Control keeps a started process or session alive across tool calls. Inside a single long-lived shell, REPL, or SSH session, state carries forward — environment variables, working directory, activated virtualenvs, open connections, REPL variables — so the agent can `cd`, activate a venv, then send commands or code into that same session many turns later without re-setup.

**Long-running processes.** Start a dev server, watcher, build, training run, or test suite in the background and keep working. The MCP returns a process handle the agent can tail, interact with, or terminate across many turns.

**Filesystem reach beyond the IDE workspace.** Read, write, move, list, and inspect files anywhere the user has granted scope.

**Surgical edits to existing files.** The `edit_block` tool does exact-string find-and-replace with fuzzy matching fallback.

**Binary and structured files handled directly by the MCP.** Excel, DOCX, and PDF are first-class — read and modified through format-specific mechanisms.

**Search at scale.** Streaming, ripgrep-backed search across whole projects or folder trees. Filename search and in-file content search, with pagination.

**Remote machines via SSH.** A long-lived SSH session inside a persistent shell turns the agent into a real ops tool.

**Process management.** List, inspect, tail, and kill accessible processes.

**macOS native.** AppleScript automation, Docker commands, system info — real macOS control.

## Core tool inventory

- **Process / shell:** `start_process`, `interact_with_process`, `read_process_output`, `list_processes`, `list_sessions`, `kill_process`, `force_terminate`
- **Files (read/write):** `read_file`, `read_multiple_files`, `write_file`, `edit_block`, `write_pdf`
- **Filesystem:** `list_directory`, `get_file_info`, `move_file`, `create_directory`
- **Search:** `start_search`, `get_more_search_results`, `list_searches`, `stop_search`
- **macOS:** `applescript`, `docker_command`, `system_info`
- **Diagnostics / config:** `get_recent_tool_calls`, `get_config`

## Conventions

**Prefer absolute paths.** Relative paths may fail depending on the working directory, and tilde paths (`~/...`) may not expand in all contexts. Absolute paths are the most reliable.

**Allowed-directory scope.** File operations only work inside the user's configured `allowedDirectories`.

**Platform awareness.** macOS: default shell is zsh, use `python3`, `brew` is the package manager. Linux/Windows: adjust accordingly. Detect host platform via `get_config` or shell.
