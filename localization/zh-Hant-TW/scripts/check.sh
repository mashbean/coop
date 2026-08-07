#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
locale_root="$repo_root/localization/zh-Hant-TW"
manifest="$locale_root/sources.tsv"
expected_header=$'source_path\tlocalized_path\tsource_commit\tstatus\tlanguage_review\tdomain_review\tnotes'
allowed_statuses='not_started draft translated reviewed stale blocked'
allowed_review_statuses='pending in_review changes_requested approved not_required'
errors=0

if [[ "$(head -n 1 "$manifest")" != "$expected_header" ]]; then
  echo "Unexpected sources.tsv header" >&2
  errors=$((errors + 1))
fi

while IFS=$'\t' read -r source_path localized_path source_commit status language_review domain_review notes; do
  if [[ "$source_path" == "source_path" || -z "$source_path" ]]; then
    continue
  fi

  if [[ ! -f "$repo_root/$source_path" ]]; then
    echo "Missing source file: $source_path" >&2
    errors=$((errors + 1))
  fi

  if [[ ! "$source_commit" =~ ^[0-9a-f]{40}$ ]] || ! git cat-file -e "$source_commit^{commit}" 2>/dev/null; then
    echo "Invalid source commit for $source_path: $source_commit" >&2
    errors=$((errors + 1))
  fi

  if [[ " $allowed_statuses " != *" $status "* ]]; then
    echo "Invalid status for $source_path: $status" >&2
    errors=$((errors + 1))
  fi

  if [[ " $allowed_review_statuses " != *" $language_review "* ]]; then
    echo "Invalid language review status for $source_path: $language_review" >&2
    errors=$((errors + 1))
  fi

  if [[ " $allowed_review_statuses " != *" $domain_review "* ]]; then
    echo "Invalid domain review status for $source_path: $domain_review" >&2
    errors=$((errors + 1))
  fi

  if [[ "$status" == "reviewed" ]]; then
    if [[ "$language_review" != "approved" ]]; then
      echo "Reviewed source lacks approved language review: $source_path" >&2
      errors=$((errors + 1))
    fi

    if [[ "$domain_review" != "approved" && "$domain_review" != "not_required" ]]; then
      echo "Reviewed source lacks completed domain review: $source_path" >&2
      errors=$((errors + 1))
    fi
  fi

  if [[ "$status" != "not_started" && ! -f "$repo_root/$localized_path" ]]; then
    echo "Missing localized file for $source_path: $localized_path" >&2
    errors=$((errors + 1))
  fi

  if [[ "$status" == "translated" || "$status" == "reviewed" ]]; then
    if ! git diff --quiet "$source_commit"..HEAD -- "$source_path"; then
      echo "Source changed after recorded commit: $source_path" >&2
      errors=$((errors + 1))
    fi
  fi
done < "$manifest"

if grep -RInE 'TODO_TRANSLATION|機翻待校' "$locale_root/src"; then
  echo "Unresolved translation marker found" >&2
  errors=$((errors + 1))
fi

if [[ "$errors" -ne 0 ]]; then
  echo "Localization checks failed with $errors error(s)" >&2
  exit 1
fi

echo "Localization checks passed"
