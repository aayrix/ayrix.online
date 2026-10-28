#!/usr/bin/env bash
set -euo pipefail

# Ralph Loop Orchestrator for Ayrix
# Inspired by Geoffrey Huntley's Ralph Wiggum autonomous loop pattern

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

PRD_FILE="${REPO_ROOT}/PRD.md"
PROGRESS_FILE="${REPO_ROOT}/progress.txt"

function log() {
  echo -e "\033[1;34m[RALPH LOOP]\033[0m $*"
}

function success() {
  echo -e "\033[1;32m[RALPH LOOP: OK]\033[0m $*"
}

function error() {
  echo -e "\033[1;31m[RALPH LOOP: FAIL]\033[0m $*" >&2
}

function verify_build() {
  log "Executing verification suite..."
  node tools/build.mjs
  node tools/check.mjs
  node tools/contrast-check.mjs
  success "All static checks, manifests, and contrast ratios verified successfully."
}

function show_status() {
  log "Current Ralph Loop Status:"
  if [ -f "${PRD_FILE}" ]; then
    local total done pending
    total=$(grep -c '^\- \[[ x/]\] \*\*TASK-' "${PRD_FILE}" || true)
    done=$(grep -c '^\- \[x\] \*\*TASK-' "${PRD_FILE}" || true)
    pending=$((total - done))
    echo "  Total Tasks:   ${total}"
    echo "  Completed:     ${done}"
    echo "  Pending:       ${pending}"
    echo ""
    echo "Next pending tasks:"
    grep '^\- \[ \] \*\*TASK-' "${PRD_FILE}" | head -n 5 || echo "  (None - all tasks completed!)"
  else
    error "PRD.md not found!"
  fi
}

function step_task() {
  local task_id="${1:-}"
  local commit_msg="${2:-}"

  if [ -z "${task_id}" ] || [ -z "${commit_msg}" ]; then
    error "Usage: $0 step <TASK_ID> <COMMIT_MESSAGE>"
    exit 1
  fi

  log "Processing step for ${task_id}..."

  # 1. Verify build
  verify_build

  # 2. Mark task complete in PRD.md
  if grep -q "\- \[ \] \*\*${task_id}\*\*" "${PRD_FILE}"; then
    sed -i "s/- \[ \] \*\*${task_id}\*\*/- [x] **${task_id}**/" "${PRD_FILE}"
    log "Marked ${task_id} as completed in PRD.md"
  elif grep -q "\- \[x\] \*\*${task_id}\*\*" "${PRD_FILE}"; then
    log "${task_id} was already marked as completed."
  fi

  # 3. Append to progress.txt
  local timestamp
  timestamp=$(date +"%Y-%m-%d %H:%M:%S %Z")
  cat >> "${PROGRESS_FILE}" <<EOF

### Task Completed: ${task_id} [${timestamp}]
- Commit Summary: ${commit_msg}
- Verification: build.mjs, check.mjs, contrast-check.mjs PASSED
EOF

  # 4. Git commit
  git add -A
  git commit -m "${task_id}: ${commit_msg}"
  success "Committed ${task_id}: ${commit_msg}"
}

case "${1:-status}" in
  verify)
    verify_build
    ;;
  status)
    show_status
    ;;
  step)
    shift
    step_task "$@"
    ;;
  *)
    echo "Usage: $0 {status|verify|step <task_id> <commit_message>}"
    exit 1
    ;;
esac
