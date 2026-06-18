#!/bin/bash
BASE_URL="http://localhost:5000/api/admin"

echo "---------------------------------------------------"
echo "Testing Recent Submissions (Should be 200 OK)"
echo "---------------------------------------------------"
curl -s -X GET $BASE_URL/get-recent-submissions \
  -H "Content-Type: application/json" | python3 -m json.tool

echo -e "\n---------------------------------------------------"
