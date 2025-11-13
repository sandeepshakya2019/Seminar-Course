#!/usr/bin/env bash
# wait-for-it.sh: wait until a TCP host:port is available
set -e

HOST=$1
shift
PORT=${HOST#*:}
HOST=${HOST%:*}
shift

until nc -z "$HOST" "$PORT"; do
  echo "Waiting for $HOST:$PORT..."
  sleep 2
done

echo "$HOST:$PORT is up — executing command."
exec "$@"
