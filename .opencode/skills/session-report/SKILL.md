---
name: generate-session-report
description: Generates an HTML report analyzing all opencode sessions for the legros.dev project (total tokens, focus score, git commits, code types, and status).
---

# generate-session-report

This skill generates a detailed HTML session report by extracting data from the local Opencode SQLite database.

## Usage

When the user asks to "generate the session report" or "get session stats", follow these steps:

1. Execute the python script bundled with this skill:
   `bash: python3 .opencode/skills/session-report/generate.py`

2. If the user mentions that there are **new sessions** that lack a detailed summary, focus score, or code types:
   - First, query the latest sessions via SQLite to see what they were about.
   - Edit the dictionaries inside `.opencode/skills/session-report/generate.py` (specifically `new_session_mappings` or `session_data`) to assign a concise `title`, `summary`, `score` (out of 10), and `types` (code types like HTML, CSS).
   - Re-run the python script to generate the updated report.

3. The final report is always output to `.temp/session_report.html`. Direct the user to open this file in their browser.
