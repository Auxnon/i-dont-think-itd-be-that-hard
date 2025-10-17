#!/bin/bash

# Script to create test users for the dating app
# Usage: ./create-test-users.sh

API_URL="http://localhost:5000/api"

echo "Creating test users..."

# Create and update users
users=(
  '{"email":"alice@example.com","name":"Alice","authProvider":"email"}:{"name":"Alice","bio":"Love hiking and photography","age":28}'
  '{"email":"bob@example.com","name":"Bob","authProvider":"email"}:{"name":"Bob","bio":"Music lover and chef","age":32}'
  '{"email":"charlie@example.com","name":"Charlie","authProvider":"email"}:{"name":"Charlie","bio":"Software engineer who loves cats","age":29}'
  '{"email":"diana@example.com","name":"Diana","authProvider":"email"}:{"name":"Diana","bio":"Yoga instructor and traveler","age":26}'
  '{"email":"emma@example.com","name":"Emma","authProvider":"email"}:{"name":"Emma","bio":"Artist and coffee enthusiast","age":31}'
  '{"email":"frank@example.com","name":"Frank","authProvider":"email"}:{"name":"Frank","bio":"Fitness trainer and foodie","age":34}'
)

user_id=2

for user_data in "${users[@]}"; do
  IFS=':' read -r create_data update_data <<< "$user_data"
  
  echo "Creating user: $(echo $create_data | jq -r .name)"
  curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "$create_data" > /dev/null
  
  echo "Updating profile for user ID $user_id"
  curl -s -X PUT "$API_URL/auth/user/$user_id" \
    -H "Content-Type: application/json" \
    -d "$update_data" > /dev/null
  
  ((user_id++))
  echo "✓ Done"
  echo ""
done

echo "All test users created successfully!"
echo ""
echo "You can now log in and swipe through these profiles."
echo "Login with any email to get started (e.g., demo@example.com)"
