#!/bin/bash
BASE_URL="http://localhost:5000/api/admin"
EMAIL="yuvrajdev20004@gmail.com"

echo "---------------------------------------------------"
echo "1. Creating User..."
echo "---------------------------------------------------"
curl -X POST $BASE_URL/create-user \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Admin User\", \"email\": \"$EMAIL\", \"role\": \"admin\"}"

echo -e "\n\n---------------------------------------------------"
echo "2. Logging in (Requesting OTP)..."
echo "---------------------------------------------------"
curl -X POST $BASE_URL/login-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}"

echo -e "\n\n[ACTION REQUIRED] Check your email for the OTP and enter it below:"
read otp

echo -e "\n---------------------------------------------------"
echo "3. Verifying OTP..."
echo "---------------------------------------------------"
curl -X POST $BASE_URL/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"otp\": \"$otp\"}"

echo -e "\n\n---------------------------------------------------"
echo "Done."
echo "---------------------------------------------------"
