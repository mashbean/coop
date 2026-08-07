#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
locale_root="$repo_root/localization/zh-Hant-TW"
mdbook_bin="${MDBOOK_BIN:-mdbook}"

"$locale_root/scripts/check.sh"
node "$locale_root/scripts/check-language.mjs"
node "$locale_root/scripts/check-fidelity.mjs"

if ! command -v "$mdbook_bin" >/dev/null 2>&1; then
  echo "mdBook executable not found: $mdbook_bin" >&2
  echo "Install mdBook or set MDBOOK_BIN to its executable path." >&2
  exit 1
fi

"$mdbook_bin" build "$locale_root"
node "$locale_root/scripts/check-rendered-links.mjs" "$locale_root/book"
git diff --check -- "$locale_root"

echo "All Traditional Chinese localization checks passed"
