# MCQ Platform API - Postman Collection Setup Guide

## Overview
This guide explains how to import and use the Postman collection for the MCQ Platform API.

## File Location
- **Collection File**: `postman-collection.json` (in the backend root directory)

## Installation Steps

### 1. Import Collection into Postman

#### Method A: Using Postman App
1. Open **Postman Desktop Application**
2. Click **Import** button (top-left)
3. Click **Upload Files**
4. Select `postman-collection.json`
5. Click **Import**

#### Method B: Using Postman Web
1. Go to [postman.com](https://www.postman.com)
2. Sign in to your account
3. Click **Import** button
4. Select **Upload Files**
5. Upload `postman-collection.json`

### 2. Configure Environment Variables

Once imported, you need to set up the variables:

#### Default Variables:
- **baseUrl**: `http://localhost:3002` (Change if your server runs on different port)
- **authToken**: Leave empty initially, will be populated after login
- **adminToken**: Leave empty initially (for admin endpoints)

#### To Update Variables:
1. In Postman, select the collection
2. Click **Variables** tab
3. Update the values:
   - `baseUrl`: Your API server URL
   - `authToken`: Will be set after login/register
   - `adminToken`: Will be set after login with admin account

## API Endpoints Overview

### 1. **Health Check**
- **GET** `/api/health`
- No authentication required
- Use this to verify the API is running

### 2. **Authentication** (`/api/v1/auth`)

#### Send OTP
- **POST** `/api/v1/auth/send-otp`
- **Body**: `{ "mobile": "01812345678" }`
- **Response**: Success message

#### Verify OTP
- **POST** `/api/v1/auth/verify-otp`
- **Body**: `{ "mobile": "01812345678", "code": "1234" }`
- **Response**: Success message

#### Register
- **POST** `/api/v1/auth/register`
- **Body**: `{ "mobile": "01812345678", "password": "MyPassword123" }`
- **Response**: User object + JWT token

#### Login
- **POST** `/api/v1/auth/login`
- **Body**: `{ "mobile": "01812345678", "password": "MyPassword123" }`
- **Response**: User object + JWT token
- **Note**: Copy the `token` value and paste it in the `authToken` variable

#### Reset Password
- **POST** `/api/v1/auth/reset-password`
- Requires OTP verification first

#### Get Current User
- **GET** `/api/v1/auth/me`
- **Headers**: `Authorization: Bearer {{authToken}}`

### 3. **Exam Categories** (`/api/v1/exam-categories`)

#### Get All Categories
- **GET** `/api/v1/exam-categories`
- Public endpoint

#### Get by Slug
- **GET** `/api/v1/exam-categories/{slug}`
- Example: `/api/v1/exam-categories/bcs-exam`

#### Create Category (Admin Only)
- **POST** `/api/v1/exam-categories`
- **Headers**: `Authorization: Bearer {{adminToken}}`
- **Body**:
```json
{
  "name": "Category Name",
  "slug": "category-slug",
  "description": "Description",
  "icon": "https://example.com/icon.png",
  "isActive": true
}
```

#### Update Category (Admin Only)
- **PATCH** `/api/v1/exam-categories/{id}`
- **Headers**: `Authorization: Bearer {{adminToken}}`

#### Delete Category (Admin Only)
- **DELETE** `/api/v1/exam-categories/{id}`
- **Headers**: `Authorization: Bearer {{adminToken}}`

### 4. **Sub Exam Categories** (`/api/v1/sub-exam-categories`)

#### Get by Parent Category
- **GET** `/api/v1/sub-exam-categories/by-category/{categorySlug}`
- Example: `/api/v1/sub-exam-categories/by-category/bcs-exam`

#### Get User Summary
- **GET** `/api/v1/sub-exam-categories/summary/{categorySlug}`
- **Headers**: `Authorization: Bearer {{authToken}}`

### 5. **Packages** (`/api/v1/packages`)

#### Get All Packages
- **GET** `/api/v1/packages`
- Public endpoint - view available packages

#### Get My Package
- **GET** `/api/v1/packages/my-package`
- **Headers**: `Authorization: Bearer {{authToken}}`
- Returns current active package

#### Get My Package History
- **GET** `/api/v1/packages/my-packages`
- **Headers**: `Authorization: Bearer {{authToken}}`

#### Get Profile
- **GET** `/api/v1/packages/profile`
- **Headers**: `Authorization: Bearer {{authToken}}`

#### Update Profile
- **PATCH** `/api/v1/packages/profile`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Body**:
```json
{
  "name": "User Name",
  "photo": "https://example.com/photo.jpg"
}
```

#### Submit Payment
- **POST** `/api/v1/packages/payments`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Body**:
```json
{
  "packageId": "pkg1",
  "paymentMethod": "bkash",
  "transactionId": "TXN12345678",
  "amount": 299
}
```

### 6. **Notifications** (`/api/v1/notifications`)

#### Get My Notifications
- **GET** `/api/v1/notifications`
- **Headers**: `Authorization: Bearer {{authToken}}`

#### Get Unread Count
- **GET** `/api/v1/notifications/unread-count`
- **Headers**: `Authorization: Bearer {{authToken}}`

#### Mark as Read
- **POST** `/api/v1/notifications/{id}/read`
- **Headers**: `Authorization: Bearer {{authToken}}`

### 7. **Syllabuses** (`/api/v1/syllabuses`)

#### Get All Syllabuses
- **GET** `/api/v1/syllabuses`
- Public endpoint

#### Get by Sub-Category
- **GET** `/api/v1/syllabuses/by-sub-category/{subCategorySlug}`

## Authentication Flow

### Step 1: Register New User
1. **Send OTP**: POST `/api/v1/auth/send-otp`
   - Enter your mobile: `01812345678`
   
2. **Verify OTP**: POST `/api/v1/auth/verify-otp`
   - Check your SMS for the 4-digit OTP code
   - Enter mobile and OTP code
   
3. **Register**: POST `/api/v1/auth/register`
   - Enter mobile and password
   - **Copy the `token` from response**

### Step 2: Use the Token
1. In Postman, go to **Variables** tab
2. Paste the token in `authToken` field
3. All authenticated endpoints will now use `{{authToken}}`

### Step 3: Login for Future Sessions
1. **Login**: POST `/api/v1/auth/login`
   - Enter mobile and password
   - Copy new token and update `authToken` variable

## Example Workflow

1. **Health Check**
   - GET `/api/health` → Verify API is running

2. **Register User**
   - POST `/api/v1/auth/send-otp` → Send OTP to 01812345678
   - POST `/api/v1/auth/verify-otp` → Verify with OTP code
   - POST `/api/v1/auth/register` → Create account
   - Copy token → Update `authToken` variable

3. **Explore Data**
   - GET `/api/v1/exam-categories` → See all exam categories
   - GET `/api/v1/sub-exam-categories/by-category/bcs-exam` → See sub-categories
   - GET `/api/v1/packages` → See available packages

4. **User Operations**
   - GET `/api/v1/auth/me` → Get current user info
   - GET `/api/v1/packages/profile` → Get user profile
   - PATCH `/api/v1/packages/profile` → Update profile
   - POST `/api/v1/packages/payments` → Submit payment

## Mobile Number Format

- **Country**: Bangladesh
- **Format**: 11 digits starting with 01
- **Example**: `01812345678`
- Valid prefixes: 013, 014, 015, 016, 017, 018, 019

## Password Requirements

- Minimum: 6 characters
- Maximum: 100 characters
- Examples: `MyPassword123`, `SecurePass456`

## Admin Operations

Admin endpoints require a user with `ADMIN` role. To test:

1. Create a user account as above
2. Manually promote the user to ADMIN in database
3. Login with admin account
4. Copy admin token to `adminToken` variable
5. Use admin endpoints with `{{adminToken}}`

### Admin Endpoints:
- Create, Update, Delete Exam Categories
- Create, Update, Delete Sub Exam Categories
- Create, Update, Delete Packages
- Create, Update, Delete Notifications
- Bulk operations for most entities

## Troubleshooting

### 401 Unauthorized
- Token is missing or invalid
- Copy fresh token from login/register response
- Update `authToken` variable

### 403 Forbidden
- User doesn't have admin role
- Use regular user token instead of admin token

### 400 Bad Request
- Check request body format
- Verify mobile number is 11 digits
- Ensure all required fields are present

### 404 Not Found
- Resource doesn't exist
- Check the ID or slug is correct
- Verify the resource was created

## Server Configuration

If your server is running on a different port or host:

1. In Postman, go to **Variables**
2. Update `baseUrl`:
   - Local: `http://localhost:3002`
   - Production: `https://api.yourdomain.com`
   - Docker: `http://docker-host:3002`

## Testing Tips

### 1. Use Pre-request Scripts
Add to capture tokens automatically:
```javascript
// In Post-response script of Login endpoint
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("authToken", jsonData.data.token);
}
```

### 2. Create Test Collections
- Separate collection for each feature
- Use variables for common values
- Write assertions in Tests tab

### 3. Monitor Requests
- Use Postman Console (bottom-left)
- Check request/response headers
- Verify Content-Type is `application/json`

## Related Documentation

- Server: See `backend/README.md`
- Database Schema: See `backend/prisma/schema/`
- API Architecture: See `backend/docs/express-api-architecture.md`
- Error Handling: See error responses in each endpoint example

## Support

For issues with:
- **API**: Check server logs and error responses
- **Postman**: Refer to [Postman Documentation](https://learning.postman.com/)
- **Collection**: Update variables and verify baseUrl

## License

MCQ Platform API - All rights reserved
