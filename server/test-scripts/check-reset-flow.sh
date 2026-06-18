#!/bin/bash

# Configuration
URL="http://localhost:5000"
EMAIL="yuvrajdev20004@gmail.com"
NEW_PASSWORD="newpassword123"

# Ensure jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq is not installed."
    exit 1
fi

echo "==========================================="
echo "Testing Full Reset Password Flow"
echo "==========================================="

# 1. Request OTP
echo ""
echo "[1] Requesting OTP for $EMAIL..."
curl -X POST "$URL/admin/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}" \
  -s | jq .

# 2. Get OTP from DB
echo ""
echo "[2] Fetching OTP from database..."
OTP=$(node test-scripts/get-otp.js "$EMAIL" | tail -n 1)
echo "Fetched OTP: $OTP"

# 3. Verify OTP
echo ""
echo "[3] Verifying OTP..."
curl -X POST "$URL/admin/verify-forgot-password-otp" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"otp\": \"$OTP\"}" \
  -s | jq .

# 4. Reset Password
echo ""
echo "[4] Resetting Password..."
RESET_RESPONSE=$(curl -X POST "$URL/admin/reset-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"otp\": \"$OTP\", \"password\": \"$NEW_PASSWORD\"}" \
  -s)

echo "$RESET_RESPONSE" | jq .

# Check if success
if [ "$(echo "$RESET_RESPONSE" | jq -r .success)" == "true" ]; then
    echo "✅ PASSWORD RESET SUCCESSFUL"
else
    echo "❌ PASSWORD RESET FAILED"
    exit 1
fi

# 5. Login with New Password
echo ""
echo "[5] Logging in with new password..."
LOGIN_RESPONSE=$(curl -X POST "$URL/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$NEW_PASSWORD\"}" \
  -s)

echo "$LOGIN_RESPONSE" | jq .

if [ "$(echo "$LOGIN_RESPONSE" | jq -r .success)" == "true" ]; then
    echo "✅ LOGIN SUCCESSFUL"
else
    echo "❌ LOGIN FAILED"
    exit 1
fi
