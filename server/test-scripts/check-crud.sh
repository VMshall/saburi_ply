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
echo "Token: $TOKEN"

if [ -z "$TOKEN" ] || [ "$TOKEN" == "None" ]; then
    echo "Failed to get token. Exiting."
    exit 1
fi

AUTH_HEADER="Authorization: Bearer $TOKEN"

# 2. Test Get Partners
echo -e "\n---------------------------------------------------"
echo "2. GET /partners (Limit 2)"
echo "---------------------------------------------------"
curl -s -X GET "$BASE_URL/partners?limit=2" \
  -H "$AUTH_HEADER" | python3 -m json.tool

# 3. Test Get Contacts
echo -e "\n---------------------------------------------------"
echo "3. GET /contacts (Limit 2)"
echo "---------------------------------------------------"
curl -s -X GET "$BASE_URL/contacts?limit=2" \
  -H "$AUTH_HEADER" | python3 -m json.tool

# 4. Test Get Users
echo -e "\n---------------------------------------------------"
echo "4. GET /users (Limit 2)"
echo "---------------------------------------------------"
curl -s -X GET "$BASE_URL/users?limit=2" \
  -H "$AUTH_HEADER" | python3 -m json.tool

echo -e "\n---------------------------------------------------"
echo "Done."
echo "---------------------------------------------------"
