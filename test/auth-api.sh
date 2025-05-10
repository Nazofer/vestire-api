#!/bin/bash

# Базовий URL API
API_URL="http://localhost:3000"

# Кольори для виводу
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Функція для виводу заголовка
print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}\n"
}

# Функція для виконання запиту
make_request() {
    echo "Запит: $1"
    echo "Відповідь:"
    eval "$1"
    echo -e "\n"
}

# Тестові дані
EMAIL="test@example.com"
PASSWORD="testPassword123"

# 1. Реєстрація/Логін
print_header "Реєстрація/Логін"

# Перший логін (створення суперкористувача)
make_request "curl -X POST $API_URL/auth/login \
    -H 'Content-Type: application/json' \
    -d '{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}'"

# Зберігаємо токени
RESPONSE=$(curl -s -X POST $API_URL/auth/login \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

ACCESS_TOKEN=$(echo $RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $RESPONSE | jq -r '.refreshToken')
ACCOUNT_ID=$(echo $RESPONSE | jq -r '.account.id')

# 2. Оновлення токенів
print_header "Оновлення токенів"

make_request "curl -X POST $API_URL/auth/refresh \
    -H 'Authorization: Bearer $REFRESH_TOKEN'"

# 3. Підтвердження пароля
print_header "Підтвердження пароля"

NEW_PASSWORD="newPassword123"
make_request "curl -X POST $API_URL/auth/confirm-password \
    -H 'Authorization: Bearer $ACCESS_TOKEN' \
    -H 'Content-Type: application/json' \
    -d '{\"id\":\"$ACCOUNT_ID\",\"password\":\"$NEW_PASSWORD\"}'"

# 4. Отримання інформації про акаунт
print_header "Отримання інформації про акаунт"

make_request "curl -X GET $API_URL/auth/account/$ACCOUNT_ID \
    -H 'Authorization: Bearer $ACCESS_TOKEN'"

# 5. Тест невалідного токена
print_header "Тест невалідного токена"

make_request "curl -X GET $API_URL/auth/account/$ACCOUNT_ID \
    -H 'Authorization: Bearer invalid_token'"

# 6. Тест неправильного пароля
print_header "Тест неправильного пароля"

make_request "curl -X POST $API_URL/auth/login \
    -H 'Content-Type: application/json' \
    -d '{\"email\":\"$EMAIL\",\"password\":\"wrongPassword\"}'" 