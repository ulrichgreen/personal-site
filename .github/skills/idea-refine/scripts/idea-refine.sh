#!/bin/bash
set -e

# Checks that the repo's idea lifecycle docs are in place. Refined ideas land
# in docs/inspiration.md, graduate to docs/future-ideas.md when worth
# remembering, and move to docs/roadmap.md when they become planned work.

STATUS="ready"

for doc in docs/inspiration.md docs/future-ideas.md docs/roadmap.md; do
  if [ -f "$doc" ]; then
    echo "Found: $doc" >&2
  else
    echo "Missing: $doc" >&2
    STATUS="incomplete"
  fi
done

echo "{\"status\": \"$STATUS\", \"lifecycle\": [\"docs/inspiration.md\", \"docs/future-ideas.md\", \"docs/roadmap.md\"]}"
