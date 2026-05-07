#!/usr/bin/env bash
# Interactive helper to log a new press mention.
# Appends a row to docs/press/mentions.md and reminds you to save a PDF.
#
# Usage:
#   bash scripts/add-press-mention.sh
#
# No arguments. Prompts you through the fields. Quits cleanly on Ctrl+C.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="$REPO_ROOT/docs/press/mentions.md"
ARCHIVE_DIR="$REPO_ROOT/docs/press/archive"

if [[ ! -f "$LOG_FILE" ]]; then
  echo "Error: $LOG_FILE does not exist."
  exit 1
fi

mkdir -p "$ARCHIVE_DIR"

echo "─── Add a press mention ─────────────────────────────────────"
echo

read -rp "Date (YYYY-MM-DD, blank = today): " DATE
[[ -z "$DATE" ]] && DATE=$(date +%Y-%m-%d)

read -rp "Publication name (e.g. Mint, YourStory): " PUBLICATION
if [[ -z "$PUBLICATION" ]]; then
  echo "Publication name required. Aborting."
  exit 1
fi

echo "Tier: 1 = mainstream/national, 2 = tech/startup, 3 = niche/vertical"
read -rp "Tier (1/2/3): " TIER
case "$TIER" in
  1|2|3) ;;
  *) echo "Invalid tier. Aborting."; exit 1 ;;
esac

read -rp "Article title: " TITLE
[[ -z "$TITLE" ]] && { echo "Title required. Aborting."; exit 1; }

read -rp "URL: " URL
[[ -z "$URL" ]] && { echo "URL required. Aborting."; exit 1; }

PUB_SLUG=$(echo "$PUBLICATION" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9' '-' | sed 's/-*$//')
PDF_NAME="${DATE}-${PUB_SLUG}.pdf"
PDF_PATH="docs/press/archive/$PDF_NAME"

echo
echo "Theme tags (comma-separated; one of: launch, founder, safety-data,"
echo "women-travel, tech-india, funding, milestone, partnership):"
read -rp "Tags: " TAGS

read -rp "Notes (optional, single line): " NOTES

# Compose the row
ROW="| | $DATE | $PUBLICATION | T$TIER | $TITLE | [link]($URL) | [pdf]($PDF_PATH) | $TAGS · $NOTES |"

# Insert as the FIRST data row in the table — find the divider line and
# insert after it. We use a marker the README has: the placeholder row.
PLACEHOLDER_REGEX="| _Add the first row when your first piece publishes_"

if grep -qF "_Add the first row when your first piece publishes_" "$LOG_FILE"; then
  # Replace the placeholder with our new row
  python3 - <<PY
from pathlib import Path
p = Path("$LOG_FILE")
text = p.read_text()
old = "| _Add the first row when your first piece publishes_ | | | | | | | |"
new = """$ROW"""
text = text.replace(old, new)
p.write_text(text)
PY
else
  # Insert as the new top data row, right after the table header divider.
  python3 - <<PY
from pathlib import Path
p = Path("$LOG_FILE")
lines = p.read_text().splitlines(keepends=True)
out = []
inserted = False
for i, line in enumerate(lines):
    out.append(line)
    if not inserted and line.startswith("|---|---|---|---|---|---|---|---|"):
        out.append("""$ROW""" + "\n")
        inserted = True
p.write_text("".join(out))
PY
fi

echo
echo "✓ Logged: $PUBLICATION ($DATE)"
echo
echo "NEXT STEPS:"
echo "  1. Save the article as PDF to: $PDF_PATH"
echo "     (Print to PDF in browser, or use a service like printfriendly.com)"
echo "  2. git add docs/press/ && git commit -m 'press: log $PUBLICATION mention'"
echo "  3. If Tier-1 or Tier-2: forward to your investor update list"
echo
echo "Mention count by tier (open docs/press/mentions.md to see):"
grep -c '| T1 |' "$LOG_FILE" 2>/dev/null | xargs -I{} echo "  Tier 1: {}"
grep -c '| T2 |' "$LOG_FILE" 2>/dev/null | xargs -I{} echo "  Tier 2: {}"
grep -c '| T3 |' "$LOG_FILE" 2>/dev/null | xargs -I{} echo "  Tier 3: {}"
