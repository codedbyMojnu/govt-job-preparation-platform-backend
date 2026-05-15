# MCQ Platform API - Quick Reference & cURL Examples

## Base URL
```
http://localhost:3002
```

## Authentication Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Health Check

### Request
```bash
curl -X GET http://localhost:3002/api/health
```

### Response
```json
{
  "status": "ok",
  "timestamp": "2026-05-13T10:00:00.000Z"
}
```

---

## Authentication Endpoints

### 1. Send OTP

**Request:**
```bash
curl -X POST http://localhost:3002/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "01812345678"
  }'
```

**Response:**
```json
{
  "data": {
    "message": "OTP sent successfully"
  }
}
```

---

### 2. Verify OTP

**Request:**
```bash
curl -X POST http://localhost:3002/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "01812345678",
    "code": "1234"
  }'
```

**Response:**
```json
{
  "data": {
    "message": "OTP verified successfully"
  }
}
```

---

### 3. Register

**Request:**
```bash
curl -X POST http://localhost:3002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "01812345678",
    "password": "MySecurePassword123"
  }'
```

**Response (Save token):**
```json
{
  "data": {
    "user": {
      "id": "clx123abc",
      "mobile": "01812345678",
      "name": null,
      "photo": null,
      "role": "USER",
      "isActive": true,
      "createdAt": "2026-05-13T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHgxMjNhYmMiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcxNTA0MDAwMCwiZXhwIjoxNzE1MDQwOTAwfQ.signature"
  }
}
```

---

### 4. Login

**Request:**
```bash
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "01812345678",
    "password": "MySecurePassword123"
  }'
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "clx123abc",
      "mobile": "01812345678",
      "name": "John Doe",
      "photo": null,
      "role": "USER",
      "isActive": true,
      "createdAt": "2026-05-13T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 5. Reset Password

**Request:**
```bash
curl -X POST http://localhost:3002/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "01812345678",
    "password": "NewSecurePassword456"
  }'
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "clx123abc",
      "mobile": "01812345678",
      "name": null,
      "photo": null,
      "role": "USER",
      "isActive": true,
      "createdAt": "2026-05-13T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 6. Get Current User

**Request:**
```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:3002/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "data": {
    "id": "clx123abc",
    "mobile": "01812345678",
    "name": "John Doe",
    "photo": null,
    "role": "USER",
    "isActive": true,
    "createdAt": "2026-05-13T10:00:00.000Z"
  }
}
```

---

## Exam Categories

### Get All Categories

**Request:**
```bash
curl -X GET http://localhost:3002/api/v1/exam-categories
```

**Response:**
```json
{
  "data": [
    {
      "id": "cat1",
      "slug": "bcs-exam",
      "name": "BCS Exam",
      "description": "Bank & Civil Service Exams",
      "icon": "https://example.com/bcs.png",
      "isActive": true,
      "createdAt": "2026-05-13T10:00:00.000Z"
    },
    {
      "id": "cat2",
      "slug": "medical-exam",
      "name": "Medical Exam",
      "description": "Medical Entrance Exams",
      "icon": "https://example.com/medical.png",
      "isActive": true,
      "createdAt": "2026-05-13T10:00:00.000Z"
    }
  ]
}
```

---

### Get by Slug

**Request:**
```bash
curl -X GET http://localhost:3002/api/v1/exam-categories/bcs-exam
```

**Response:**
```json
{
  "data": {
    "id": "cat1",
    "slug": "bcs-exam",
    "name": "BCS Exam",
    "description": "Bank & Civil Service Exams",
    "icon": "https://example.com/bcs.png",
    "isActive": true,
    "createdAt": "2026-05-13T10:00:00.000Z"
  }
}
```

---

### Create Category (Admin)

**Request:**
```bash
ADMIN_TOKEN="your_admin_token_here"
curl -X POST http://localhost:3002/api/v1/exam-categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "NTRCA Exam",
    "slug": "ntrca-exam",
    "description": "National Teacher Registration and Certification Authority",
    "icon": "https://example.com/ntrca.png",
    "isActive": true
  }'
```

**Response:**
```json
{
  "data": {
    "id": "cat3",
    "slug": "ntrca-exam",
    "name": "NTRCA Exam",
    "description": "National Teacher Registration and Certification Authority",
    "icon": "https://example.com/ntrca.png",
    "isActive": true,
    "createdAt": "2026-05-13T10:00:00.000Z"
  }
}
```

---

## Sub Exam Categories

### Get by Parent Category

**Request:**
```bash
curl -X GET "http://localhost:3002/api/v1/sub-exam-categories/by-category/bcs-exam"
```

**Response:**
```json
{
  "data": [
    {
      "id": "sub1",
      "examCategoryId": "cat1",
      "slug": "bcs-english",
      "name": "English",
      "description": "English for BCS Exam",
      "icon": "https://example.com/english.png",
      "isActive": true
    },
    {
      "id": "sub2",
      "examCategoryId": "cat1",
      "slug": "bcs-math",
      "name": "Mathematics",
      "description": "Mathematics for BCS Exam",
      "icon": "https://example.com/math.png",
      "isActive": true
    }
  ]
}
```

---

### Get User Summary

**Request:**
```bash
TOKEN="your_jwt_token_here"
curl -X GET "http://localhost:3002/api/v1/sub-exam-categories/summary/bcs-exam" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "data": {
    "userId": "clx123abc",
    "examCategoryId": "cat1",
    "subCategories": [
      {
        "id": "sub1",
        "name": "English",
        "totalQuestions": 50,
        "answeredQuestions": 25,
        "correctAnswers": 20
      },
      {
        "id": "sub2",
        "name": "Mathematics",
        "totalQuestions": 50,
        "answeredQuestions": 30,
        "correctAnswers": 24
      }
    ]
  }
}
```

---

## Packages

### Get All Packages

**Request:**
```bash
curl -X GET http://localhost:3002/api/v1/packages
```

**Response:**
```json
{
  "data": [
    {
      "id": "pkg1",
      "name": "Basic Package",
      "description": "1 Month Access",
      "price": 299,
      "durationDays": 30,
      "features": ["All Questions", "Exams"],
      "isActive": true
    },
    {
      "id": "pkg2",
      "name": "Premium Package",
      "description": "3 Months Access",
      "price": 799,
      "durationDays": 90,
      "features": ["All Questions", "Exams", "Progress Reports"],
      "isActive": true
    }
  ]
}
```

---

### Get My Package

**Request:**
```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:3002/api/v1/packages/my-package \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "data": {
    "id": "up1",
    "userId": "clx123abc",
    "packageId": "pkg1",
    "startDate": "2026-05-13T10:00:00.000Z",
    "endDate": "2026-06-12T10:00:00.000Z",
    "isActive": true,
    "package": {
      "id": "pkg1",
      "name": "Basic Package",
      "price": 299
    }
  }
}
```

---

### Submit Payment

**Request:**
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:3002/api/v1/packages/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "packageId": "pkg2",
    "paymentMethod": "bkash",
    "transactionId": "TXN12345678",
    "amount": 799
  }'
```

**Response:**
```json
{
  "data": {
    "id": "txn1",
    "userId": "clx123abc",
    "packageId": "pkg2",
    "amount": 799,
    "paymentMethod": "bkash",
    "transactionId": "TXN12345678",
    "status": "PENDING",
    "createdAt": "2026-05-13T10:00:00.000Z"
  }
}
```

---

## Notifications

### Get My Notifications

**Request:**
```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:3002/api/v1/notifications \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "id": "notif1",
      "title": "Welcome",
      "body": "Welcome to MCQ Platform",
      "isRead": false,
      "createdAt": "2026-05-13T10:00:00.000Z"
    }
  ]
}
```

---

### Get Unread Count

**Request:**
```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:3002/api/v1/notifications/unread-count \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "data": {
    "unreadCount": 3
  }
}
```

---

### Mark as Read

**Request:**
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:3002/api/v1/notifications/notif1/read \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "data": {
    "id": "notif1",
    "title": "Welcome",
    "body": "Welcome to MCQ Platform",
    "isRead": true
  }
}
```

---

## Syllabuses

### Get All Syllabuses

**Request:**
```bash
curl -X GET http://localhost:3002/api/v1/syllabuses
```

**Response:**
```json
{
  "data": [
    {
      "id": "syl1",
      "slug": "english-1",
      "title": "English Part 1",
      "subExamCategoryId": "sub1",
      "content": "Syllabus content here...",
      "isActive": true
    }
  ]
}
```

---

### Get by Sub-Category

**Request:**
```bash
curl -X GET "http://localhost:3002/api/v1/syllabuses/by-sub-category/bcs-english"
```

**Response:**
```json
{
  "data": [
    {
      "id": "syl1",
      "slug": "english-1",
      "title": "English Part 1",
      "subExamCategoryId": "sub1",
      "content": "Syllabus content here...",
      "isActive": true
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "mobile",
        "message": "Mobile number must be 11 digits"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "type": "UNAUTHORIZED",
    "message": "Authentication token is invalid or missing"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "type": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "type": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "type": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Using with Environment Variables (Bash)

Save this as `.env.local`:
```bash
BASE_URL="http://localhost:3002"
TOKEN=""
MOBILE="01812345678"
PASSWORD="MySecurePassword123"
```

Then source it:
```bash
source .env.local
```

Example request with variables:
```bash
curl -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "'$MOBILE'",
    "password": "'$PASSWORD'"
  }' | jq '.data.token' | xargs -I {} bash -c 'export TOKEN={} && echo "Token: $TOKEN"'
```

---

## Testing with Multiple Requests (Script)

Create `test_api.sh`:
```bash
#!/bin/bash

BASE_URL="http://localhost:3002"
MOBILE="01812345678"

# 1. Health check
echo "1. Testing health check..."
curl -s "$BASE_URL/api/health" | jq .

# 2. Get categories
echo -e "\n2. Getting exam categories..."
curl -s "$BASE_URL/api/v1/exam-categories" | jq .

# 3. Get packages
echo -e "\n3. Getting packages..."
curl -s "$BASE_URL/api/v1/packages" | jq .

echo -e "\nDone!"
```

Run it:
```bash
chmod +x test_api.sh
./test_api.sh
```

---

## Common Response Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, POST, PATCH |
| 201 | Created | Successful resource creation |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 500 | Server Error | Internal server issue |

---

## Tips & Tricks

### 1. Pretty Print JSON in cURL
```bash
curl -s http://localhost:3002/api/health | jq .
```

### 2. Save Response to File
```bash
curl -s http://localhost:3002/api/v1/packages > packages.json
```

### 3. Test All Categories
```bash
curl -s http://localhost:3002/api/v1/exam-categories | jq '.data[].slug'
```

### 4. Count Results
```bash
curl -s http://localhost:3002/api/v1/packages | jq '.data | length'
```

### 5. Filter Results
```bash
curl -s http://localhost:3002/api/v1/exam-categories | jq '.data[] | select(.isActive == true)'
```

---

## Next Steps

1. ✅ Start the backend server: `npm run dev`
2. ✅ Test health endpoint: `curl http://localhost:3002/api/health`
3. ✅ Register a new user (Send OTP → Verify → Register)
4. ✅ Login and save token
5. ✅ Explore other endpoints with token

See `POSTMAN_SETUP.md` for Postman import instructions!
