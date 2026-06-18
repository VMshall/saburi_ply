#!/bin/bash
BASE_URL="http://localhost:5000/api/admin"
EMAIL="yuvrajdev20004@gmail.com"

# 1. Login to get Token
echo "---------------------------------------------------"
echo "1. Login to get Token..."
echo "---------------------------------------------------"
# Trigger OTP
curl -s -X POST $BASE_URL/login-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}" > /dev/null

echo "OTP sent. Please enter the OTP from your email:"
read otp

# Verify OTP and get Token
RESPONSE=$(curl -s -X POST $BASE_URL/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"otp\": \"$otp\"}")

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

if [ -z "$TOKEN" ] || [ "$TOKEN" == "None" ]; then
    echo "Failed to get token. Exiting."
    exit 1
fi

AUTH_HEADER="Authorization: Bearer $TOKEN"

# 2. Test CSV Download
echo -e "\n---------------------------------------------------"
echo "2. Testing CSV Download (User)..."
echo "---------------------------------------------------"
curl -s -X GET "$BASE_URL/users/download_csv" \
  -H "$AUTH_HEADER" -o users.csv

if [ -f "users.csv" ]; then
    echo "Success: users.csv created."
    head -n 5 users.csv
else
    echo "Error: users.csv not created."
fi

# 3. Test PDF Download
echo -e "\n---------------------------------------------------"
echo "3. Testing PDF Download (Quote)..."
echo "---------------------------------------------------"
curl -s -X GET "$BASE_URL/quotes/download-pdf-format" \
  -H "$AUTH_HEADER" -o quotes.pdf

if [ -f "quotes.pdf" ]; then
    echo "Success: quotes.pdf created."
else
    echo "Error: quotes.pdf not created."
fi

echo -e "\n---------------------------------------------------"
echo "Done."
echo "---------------------------------------------------"
