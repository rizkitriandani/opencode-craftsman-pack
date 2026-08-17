#!/usr/bin/env bash
set -e

# ==============================================================================
# OpenCode Craftsman Pack Installer
# Installs Rubberduck, Unvibe, Consultant, and STAR Logger into OpenCode
# ==============================================================================

echo "🛠️  Installing OpenCode Craftsman Pack..."

CONFIG_DIR="${OPENCODE_CONFIG_DIR:-$HOME/.config/opencode}"
mkdir -p "$CONFIG_DIR/agents"
mkdir -p "$CONFIG_DIR/commands"
mkdir -p "$CONFIG_DIR/skills/rubberduck"
mkdir -p "$CONFIG_DIR/scripts"

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Copy agents
echo "🤖 Copying agents to $CONFIG_DIR/agents/..."
cp -f "$REPO_DIR/.opencode/agents/"*.md "$CONFIG_DIR/agents/" 2>/dev/null || true

# Copy commands
echo "⚡ Copying slash commands to $CONFIG_DIR/commands/..."
cp -f "$REPO_DIR/.opencode/commands/"*.md "$CONFIG_DIR/commands/" 2>/dev/null || true

# Copy skills
echo "🧠 Copying skills to $CONFIG_DIR/skills/..."
cp -rf "$REPO_DIR/.opencode/skills/"* "$CONFIG_DIR/skills/" 2>/dev/null || true

# Copy scripts
echo "📜 Copying scripts to $CONFIG_DIR/scripts/..."
cp -rf "$REPO_DIR/.opencode/scripts/"* "$CONFIG_DIR/scripts/" 2>/dev/null || true
chmod +x "$CONFIG_DIR/scripts/"*.cjs "$CONFIG_DIR/scripts/"*.js 2>/dev/null || true

echo ""
echo "✅ OpenCode Craftsman Pack installed successfully!"
echo ""
echo "Available Commands & Agents:"
echo "  • /duck [topik]     ➔ Rubberducking thinking partner (No Code Handouts)"
echo "  • /unvibe [topik]   ➔ Adversarial understanding audit & Socratic grill"
echo "  • /log [topik]      ➔ Generate STAR diary & sync to Notion Notes"
echo "  • /jelasin [topik]  ➔ Sederhana SMA Feynman explanation"
echo "  • @consultant       ➔ Senior Architect & Feynman mentor"
echo "  • @rubberduck       ➔ Logic mirror subagent"
echo ""
echo "Happy Crafting! 🚀"
