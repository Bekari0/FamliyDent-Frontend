#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/familydent}"
MONGODB_URI="${MONGODB_URI:?Set MONGODB_URI before running backup}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

mongodump \
  --uri="$MONGODB_URI" \
  --archive="$BACKUP_DIR/familydent-$TIMESTAMP.archive.gz" \
  --gzip

find "$BACKUP_DIR" -type f -name "familydent-*.archive.gz" -mtime +14 -delete

echo "Backup saved: $BACKUP_DIR/familydent-$TIMESTAMP.archive.gz"
