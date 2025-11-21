#!/bin/bash

# Exit status variable
EXIT_STATUS=0

# Cleanup function
cleanup() {
  echo "Shutting down services..."
  if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null || true
    wait $BACKEND_PID 2>/dev/null || true
  fi
  if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null || true
    wait $FRONTEND_PID 2>/dev/null || true
  fi
  exit $EXIT_STATUS
}

# Set trap for cleanup
trap cleanup EXIT INT TERM

# Validate required secrets are present
echo "Validating required secrets..."
MISSING_SECRETS=""
[ -z "$DATABASE_URL" ] && MISSING_SECRETS="$MISSING_SECRETS DATABASE_URL"
[ -z "$SUPABASE_URL" ] && MISSING_SECRETS="$MISSING_SECRETS SUPABASE_URL"
[ -z "$SUPABASE_ANON_KEY" ] && MISSING_SECRETS="$MISSING_SECRETS SUPABASE_ANON_KEY"
[ -z "$SUPABASE_SERVICE_ROLE_KEY" ] && MISSING_SECRETS="$MISSING_SECRETS SUPABASE_SERVICE_ROLE_KEY"

if [ ! -z "$MISSING_SECRETS" ]; then
  echo "ERROR: Missing required secrets:$MISSING_SECRETS"
  echo "Please set these secrets in the Replit Secrets panel."
  EXIT_STATUS=1
  exit 1
fi

# Create frontend .env.local with Vite-prefixed variables from secrets
# Note: DATABASE_URL is the Supabase project URL, SUPABASE_URL is the PostgreSQL connection string
echo "Setting up frontend environment..."
cat > frontend/.env.local << EOF
VITE_SUPABASE_URL=${DATABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
VITE_API_URL=http://localhost:3000/api
EOF

# Start backend in background with environment variables
# Pass all secrets to backend
echo "Starting backend server..."
cd backend
DATABASE_URL="$DATABASE_URL" \
SUPABASE_URL="$SUPABASE_URL" \
SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
PORT=3000 \
NODE_ENV=development \
npm start &
BACKEND_PID=$!

# Wait for backend to be ready (check health endpoint)
echo "Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "Backend is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "Backend failed to start in time"
    EXIT_STATUS=1
    exit 1
  fi
  sleep 1
done

# Start frontend in background
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for any process to exit and capture its status
set +e
wait -n
EXIT_STATUS=$?
set -e

# If we get here, one process exited
if [ $EXIT_STATUS -ne 0 ]; then
  echo "A service exited with error status $EXIT_STATUS"
fi

# Cleanup will be called via trap
exit $EXIT_STATUS
