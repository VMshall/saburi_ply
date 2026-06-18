#!/bin/bash
BASE_URL="http://localhost:5000/api/admin"
EMAIL="yuvrajdev20004@gmail.com"

echo "---------------------------------------------------"
echo "1. Testing Dashboard Stats (Should be 200 OK)"
echo "---------------------------------------------------"
curl -X GET $BASE_URL/get-dashboard-stats \
  -H "Content-Type: application/json"

echo -e "\n\n---------------------------------------------------"
echo "2. Testing Auth: Logging in (Requesting OTP)..."
echo "---------------------------------------------------"
curl -X POST $BASE_URL/login-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}"

echo -e "\n\n---------------------------------------------------"
echo "Done."
echo "---------------------------------------------------"
