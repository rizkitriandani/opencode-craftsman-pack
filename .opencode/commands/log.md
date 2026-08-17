---
description: Generate STAR interview log and work diary, then sync to Notion
agent: star-logger
subtask: true
---

# Log Command

Generate STAR work diary and interview prep log for: $ARGUMENTS

## Your Task

1. **Context & Git Inspection**:
   - Inspect `git status -s`, `git diff --stat`, and recent `git log` to ground the summary in real code changes.
   - Review the problem, architectural decisions, and bugfixes discussed in the current session.
   - If `$ARGUMENTS` is provided, prioritize and focus the STAR log on that specific topic or feature.

2. **Synthesize STAR & Interview Pack**:
   - **🎯 Executive Summary**: 1-2 sentence high-level overview.
   - **📍 Situation**: Context, architecture, problem, constraints.
   - **📋 Task**: Core objective, scope, acceptance criteria.
   - **⚡ Action**: Technical strategy, code highlights, design tradeoffs.
   - **🏆 Result**: Concrete outcomes, tests passed, performance/correctness impact.
   - **💡 Lessons Learned**: Technical pitfalls, edge cases, and best practices.
   - **🎙️ 60-Second Interview Elevator Pitch**: Ready-to-speak narrative for job interviews.

3. **Sync to Notion & Local Backup**:
   - Build the payload JSON and sync to Notion Database "Notes" (`3f8ee720-5fd7-4fda-b9a0-8b0e60befd1b`) via `.opencode/scripts/notion-sync-star.cjs`.
   - Ensure local markdown backup is written to `.work-logs/YYYY-MM-DD-<slug>.md`.
   - Provide the direct Notion page link and summary to the user.
