# ⚡ Lambda Functions — ShopSmart Backend

This folder contains all five AWS Lambda functions that power the ShopSmart backend. Each function is deployed independently, connected to API Gateway via Lambda Proxy Integration, and communicates with Amazon DynamoDB in the `ap-south-1` (Mumbai) region.

---

## 📁 Folder Structure

```
lambda-functions/
│
├── SearchProducts/
│   └── index.mjs            # Product search with filters and sorting
│
├── GetProduct/
│   └── index.mjs            # Fetch single product by ID
│
├── GetFeaturedProducts/
│   └── index.mjs            # Fetch featured/popular products for homepage
│
├── GetRecommendations/
│   └── index.mjs            # AI recommendation engine (5 strategies)
│
├── LogUserActivity/
│   └── index.mjs            # Write user activity events to DynamoDB
│
└── README.md                # This file
```

---

## 📋 Function Summary

| Function | Runtime | Memory | Timeout | Trigger | DynamoDB Access |
|----------|---------|--------|---------|---------|----------------|
| SearchProducts | Node.js 24.x | 256 MB | 30s | GET /search | Products — Query, Scan |
| GetProduct | Node.js 24.x | 128 MB | 10s | GET /products/{id} | Products — GetItem |
| GetFeaturedProducts | Node.js 24.x | 256 MB | 15s | GET /featured | Products — Query, Scan |
| GetRecommendations | Node.js 24.x | 512 MB | 30s | GET /recommendations | Products + UserActivity — Query, Scan, GetItem |
| LogUserActivity | Node.js 24.x | 128 MB | 10s | POST /activity | UserActivity — PutItem |

---

## 🔑 IAM Permissions

Each Lambda has a dedicated execution role. Below is the minimum DynamoDB policy required per function.

### SearchProducts, GetFeaturedProducts

```json
{
  "Effect": "Allow",
  "Action": ["dynamodb:Query", "dynamodb:Scan"],
  "Resource": [
    "arn:aws:dynamodb:ap-south-1:638175212987:table/Products",
    "arn:aws:dynamodb:ap-south-1:638175212987:table/Products/index/*"
  ]
}
```

### GetProduct

```json
{
  "Effect": "Allow",
  "Action": ["dynamodb:GetItem"],
  "Resource": "arn:aws:dynamodb:ap-south-1:638175212987:table/Products"
}
```

### GetRecommendations

```json
{
  "Effect": "Allow",
  "Action": ["dynamodb:Query", "dynamodb:Scan", "dynamodb:GetItem", "dynamodb:BatchGetItem"],
  "Resource": [
    "arn:aws:dynamodb:ap-south-1:638175212987:table/Products",
    "arn:aws:dynamodb:ap-south-1:638175212987:table/Products/index/*",
    "arn:aws:dynamodb:ap-south-1:638175212987:table/UserActivity",
    "arn:aws:dynamodb:ap-south-1:638175212987:table/UserActivity/index/*",
    "arn:aws:dynamodb:ap-south-1:638175212987:table/RecommendationCache"
  ]
}
```

### LogUserActivity

```json
{
  "Effect": "Allow",
  "Action": ["dynamodb:PutItem"],
  "Resource": "arn:aws:dynamodb:ap-south-1:638175212987:table/UserActivity"
}
```

All Lambda roles also require the standard CloudWatch Logs policy:

```json
{
  "Effect": "Allow",
  "Action": ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
  "Resource": "arn:aws:logs:ap-south-1:638175212987:log-group:/aws/lambda/*"
}
```

---

## 🌐 CORS Headers

All Lambda functions return these CORS headers so the React frontend (hosted on a different domain) can call them:

```javascript
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Content-Type': 'application/json'
};
```

These headers are included in every response — including error responses — to prevent the browser from blocking the response body.

---

---

## 1. SearchProducts

**File:** `SearchProducts/index.mjs`
**Trigger:** `GET /search`

### What It Does

Searches and filters the Products DynamoDB table based on query parameters. Supports keyword search across multiple fields, category/price/vendor filters, multiple sort options, and pagination.

### Query Parameters Accepted

| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Keyword to search in name, description, brand, category, tags |
| category | string | Exact category match |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| vendor | string | Vendor name filter |
| sortBy | string | `price_asc` `price_desc` `popularity` `rating` `newest` |
| page | number | Page number (default: 1) |
| limit | number | Results per page (default: 20) |

### Logic Flow

```
1. Parse queryStringParameters from event
2. Scan/Query Products table
3. Apply keyword filter (checks name, description, brand, category, tags)
4. Apply category filter (if provided)
5. Apply price range filter (if minPrice or maxPrice provided)
6. Apply vendor filter (if provided)
7. Sort results by chosen sort option
8. Paginate (slice based on page and limit)
9. Return products array with count, page, totalPages
```

### Example Request

```bash
GET /search?q=laptop&category=Electronics&minPrice=500&maxPrice=2000&sortBy=rating&limit=10
```

### Example Response

```json
{
  "products": [
    {
      "product_id": "PROD-00042",
      "product_name": "Pro Laptop 15",
      "price": 1299.99,
      "category": "Electronics",
      "rating": 4.7
    }
  ],
  "count": 1,
  "page": 1,
  "totalPages": 1
}
```

### Lambda Test Event

```json
{
  "queryStringParameters": {
    "q": "laptop",
    "category": "Electronics",
    "sortBy": "popularity",
    "limit": "10"
  }
}
```

---

## 2. GetProduct

**File:** `GetProduct/index.mjs`
**Trigger:** `GET /products/{productId}`

### What It Does

Fetches a single product by its `product_id` using DynamoDB `GetItem`. Used by the Product Detail page.

### Path Parameter

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| productId | string | Yes | Product ID e.g. PROD-00001 |

### Logic Flow

```
1. Extract productId from event.pathParameters
2. Call DynamoDB GetItem on Products table
3. Return 404 if not found
4. Return full product object if found
```

### Example Request

```bash
GET /products/PROD-00001
```

### Example Response

```json
{
  "product": {
    "product_id": "PROD-00001",
    "product_name": "Premium Wireless Headphones",
    "description": "High-quality audio experience...",
    "price": 89.99,
    "original_price": 129.99,
    "discount_percentage": 31,
    "category": "Electronics",
    "brand": "SoundMax",
    "rating": 4.5,
    "review_count": 284,
    "stock_quantity": 45,
    "images": ["https://...", "https://..."],
    "is_featured": true,
    "vendor_name": "TechHub Marketplace"
  }
}
```

### Lambda Test Event

```json
{
  "pathParameters": {
    "productId": "PROD-00001"
  }
}
```

---

## 3. GetFeaturedProducts

**File:** `GetFeaturedProducts/index.mjs`
**Trigger:** `GET /featured`

### What It Does

Returns featured and popular products for the homepage. Prioritizes items where `is_featured = true` or `is_bestseller = true`, with high `popularity_score` items as fallback.

### Query Parameters Accepted

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 12 | Maximum number of products to return |

### Logic Flow

```
1. Parse limit from queryStringParameters (default: 12)
2. Scan Products table for is_featured = true OR is_bestseller = true OR popularity_score > 70
3. Sort by popularity_score descending
4. Limit to requested count
5. Return products array with count
```

### Example Request

```bash
GET /featured?limit=12
```

### Example Response

```json
{
  "products": [
    {
      "product_id": "PROD-00010",
      "product_name": "Essential Tablets",
      "price": 1832.43,
      "category": "Electronics",
      "is_featured": true,
      "popularity_score": 90
    }
  ],
  "count": 12
}
```

### Lambda Test Event

```json
{
  "queryStringParameters": {
    "limit": "12"
  }
}
```

---

## 4. GetRecommendations

**File:** `GetRecommendations/index.mjs`
**Trigger:** `GET /recommendations`

### What It Does

The core AI recommendation engine. Implements 5 different recommendation strategies and selects the appropriate one based on the incoming query parameters. Returns a scored, ranked list of products.

### Query Parameters Accepted

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | string | No | Cognito sub ID — triggers personalized strategy |
| product_id | string | No | Product ID — triggers product-based strategies |
| type | string | No | `frequently-bought` `similar` `also-viewed` |
| limit | number | No | Number of results (default: 8) |

### Strategy Selection Logic

```
if (user_id provided)
    → getPersonalizedRecommendations(userId)

else if (product_id + type === "frequently-bought")
    → getFrequentlyBoughtTogether(productId)

else if (product_id + type === "similar")
    → getCategoryBasedSimilar(productId)

else if (product_id + type === "also-viewed")
    → getUsersAlsoViewed(productId)

else
    → getColdStartRecommendations()
```

All strategies fall back to `getColdStartRecommendations()` on error or empty result.

### Strategy Details

#### Strategy 1 — Personalized User-Based

**When:** `user_id` is provided

**Algorithm:**
1. Query `UserActivity` table for user's last 50 events (most recent first)
2. Extract unique product IDs from those events
3. Fetch each product from `Products` table to determine its category
4. Count category occurrences to identify user's top 3 preferred categories
5. Query `CategoryIndex` GSI for products in those categories (15 per category)
6. Filter out products the user has already viewed or purchased
7. Remove duplicates
8. Apply weighted scoring formula
9. Return top N results

**Weighted Score:**
```
score = (popularity_score × 0.4) + ((rating / 5 × 100) × 0.3) + ((sales_count / 10) × 0.3)
```

**Example call:**
```bash
GET /recommendations?user_id=81231d3a-a0d1-7027-e3ea-8f912b363db5&limit=8
```

---

#### Strategy 2 — Frequently Bought Together

**When:** `product_id` + `type=frequently-bought`

**Algorithm:**
1. Query `ProductActivityIndex` GSI for `purchase` events on the target product
2. Get the list of `user_id` values who purchased it
3. Query UserActivity for each of those users — find all their other purchases
4. Count how many times each co-purchased product appears
5. Exclude the original product from results
6. Sort by co-purchase frequency descending
7. Return top N results

**Example call:**
```bash
GET /recommendations?product_id=PROD-00001&type=frequently-bought&limit=4
```

---

#### Strategy 3 — Category-Based Similar Products

**When:** `product_id` + `type=similar`

**Algorithm:**
1. Fetch the target product from Products table (get category, subcategory, brand, price)
2. Query `CategoryIndex` GSI for all products in the same category
3. Score each candidate product:
   - Same subcategory: +3 points
   - Same brand: +2 points
   - Price within 30% of target: +1 point
4. Combine similarity score with popularity weighted score
5. Exclude the original product
6. Sort by combined score descending
7. Return top N results

**Example call:**
```bash
GET /recommendations?product_id=PROD-00001&type=similar&limit=8
```

---

#### Strategy 4 — Users Also Viewed

**When:** `product_id` + `type=also-viewed`

**Algorithm:**
1. Query `ProductActivityIndex` GSI for `view` events on the target product
2. Get the list of users who viewed it
3. For each user, query their UserActivity — find other products they viewed in the same session (matching `session_id`)
4. Count co-view frequency across all users
5. Exclude the original product
6. Sort by co-view count descending
7. Return top N results

**Example call:**
```bash
GET /recommendations?product_id=PROD-00001&type=also-viewed&limit=6
```

---

#### Strategy 5 — Cold-Start Popular Products (Fallback)

**When:** No parameters provided, or any strategy returns empty

**Algorithm:**
1. Scan Products table for items where `is_featured = true` OR `is_bestseller = true` OR `popularity_score > 60`
2. If no results found (edge case), fall back to a plain Scan with Limit: 20
3. Sort by `popularity_score` descending
4. Return top N results

---

### Response Format

```json
{
  "recommendations": [
    {
      "product_id": "PROD-00961",
      "product_name": "Compact Exterior",
      "price": 286.48,
      "category": "Automotive",
      "rating": 4.9,
      "popularity_score": "053",
      "images": ["https://...", "https://..."],
      "recommendation_score": 36
    }
  ],
  "strategy": "personalized_user_based",
  "count": 8,
  "type": "general"
}
```

**`strategy` values:**
- `personalized_user_based`
- `frequently_bought_together`
- `category_based_similar`
- `users_also_viewed`
- `cold_start_popular`

### Lambda Test Events

**Personalized:**
```json
{
  "queryStringParameters": {
    "user_id": "81231d3a-a0d1-7027-e3ea-8f912b363db5",
    "limit": "8"
  }
}
```

**Frequently Bought Together:**
```json
{
  "queryStringParameters": {
    "product_id": "PROD-00001",
    "type": "frequently-bought",
    "limit": "4"
  }
}
```

**Similar Products:**
```json
{
  "queryStringParameters": {
    "product_id": "PROD-00001",
    "type": "similar",
    "limit": "8"
  }
}
```

**Cold Start (no params):**
```json
{
  "queryStringParameters": {}
}
```

### CloudWatch Log Examples (Success)

```
INFO  Event: { queryStringParameters: { user_id: '81231d3a-...', limit: '8' } }
INFO  Recommendation request: { user_id: '81231d3a-...', type: 'general', limit: '8' }
INFO  Getting personalized recommendations for: 81231d3a-...
INFO  Found 41 activity items for user
INFO  User viewed 35 unique products
INFO  Fetched 20 products, found categories: { Electronics: 8, Automotive: 5, Books: 4 }
INFO  User top categories: ['Electronics', 'Automotive', 'Books']
INFO  Got 15 products from Electronics
INFO  Got 15 products from Automotive
INFO  Got 15 products from Books
INFO  Total products from categories: 45
INFO  After filtering viewed products: 38
INFO  After removing duplicates: 38
INFO  Applying weighted scoring for strategy: personalized_user_based
INFO  Returning 8 recommendations using personalized_user_based
```

---

## 5. LogUserActivity

**File:** `LogUserActivity/index.mjs`
**Trigger:** `POST /activity`

### What It Does

Writes a single user activity event to the `UserActivity` DynamoDB table. Called from the React frontend every time a user views a product, adds an item to cart, or completes a purchase. This data feeds the recommendation engine.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_id | string | Yes | Cognito sub ID of the user |
| product_id | string | Yes | Product ID being interacted with |
| event_type | string | Yes | `view` `add_to_cart` `purchase` |
| quantity | number | No | Units added or purchased |
| order_id | string | No | Order identifier for purchase events |
| session_id | string | No | Browser session ID for co-occurrence tracking |

### Logic Flow

```
1. Handle OPTIONS request (return 200 for CORS preflight)
2. Parse JSON body from event.body
3. Validate required fields: user_id, product_id, event_type
4. Validate event_type is one of: view, add_to_cart, purchase
5. Build activity item with current ISO timestamp
6. PutItem into UserActivity table
7. Return success response with logged activity details
```

### Frontend Integration

The `activityAPI` object in `frontend/src/services/api.js` calls this endpoint:

```javascript
// Called from ProductPage.jsx on mount
activityAPI.logView(productId, userId)

// Called from ProductCard.jsx and ProductPage.jsx on Add to Cart click
activityAPI.logAddToCart(productId, userId, quantity)

// Called on checkout completion
activityAPI.logPurchase(productId, userId, quantity, orderId)
```

Each call is wrapped in a try-catch so activity logging failures never break the user experience — the error is logged to console only.

### Example Request

```bash
curl -X POST "https://b6yga2ffv8.execute-api.ap-south-1.amazonaws.com/prod/activity" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "81231d3a-a0d1-7027-e3ea-8f912b363db5",
    "product_id": "PROD-00042",
    "event_type": "view",
    "session_id": "session-1708163400-abc123"
  }'
```

### Example Response

```json
{
  "success": true,
  "message": "Activity logged successfully",
  "activity": {
    "user_id": "81231d3a-a0d1-7027-e3ea-8f912b363db5",
    "product_id": "PROD-00042",
    "event_type": "view",
    "timestamp": "2026-02-17T10:30:00.123Z"
  }
}
```

### Error Responses

**Missing required field (400):**
```json
{
  "error": "Missing required fields",
  "required": ["user_id", "product_id", "event_type"],
  "received": { "user_id": true, "product_id": true, "event_type": false }
}
```

**Invalid event_type (400):**
```json
{
  "error": "Invalid event_type: clicked",
  "valid_types": ["view", "add_to_cart", "purchase"]
}
```

**DynamoDB error (500):**
```json
{
  "error": "Internal server error",
  "message": "AccessDeniedException: ...",
  "type": "AccessDeniedException"
}
```

### Lambda Test Event

```json
{
  "body": "{\"user_id\":\"81231d3a-a0d1-7027-e3ea-8f912b363db5\",\"product_id\":\"PROD-00001\",\"event_type\":\"view\",\"session_id\":\"test-session-001\"}",
  "requestContext": {
    "httpMethod": "POST"
  }
}
```

### CloudWatch Log Examples (Success)

```
INFO  LogUserActivity Event: { body: '{"user_id":"...","product_id":"PROD-00001","event_type":"view"}', ... }
INFO  Saving activity to DynamoDB: {
        user_id: '81231d3a-...',
        timestamp: '2026-02-17T10:30:00.123Z',
        product_id: 'PROD-00001',
        event_type: 'view',
        session_id: 'session-1708163400-abc123'
      }
INFO  Activity logged successfully
```

### DynamoDB Item Written

```json
{
  "user_id": "81231d3a-a0d1-7027-e3ea-8f912b363db5",
  "timestamp": "2026-02-17T10:30:00.123Z",
  "product_id": "PROD-00001",
  "event_type": "view",
  "session_id": "session-1708163400-abc123"
}
```

---

## 🚀 Deployment Guide

### Deploy a Single Function (AWS Console)

1. Open `AWS Console → Lambda → [Function Name]`
2. Click the **Code** tab
3. Click **Upload from → .zip file**
4. ZIP the `index.mjs` file from the function folder
5. Upload and click **Save**
6. Click **Deploy**

### Deploy via AWS CLI

```bash
# Navigate to function folder
cd backend/lambda-functions/SearchProducts

# Create zip
zip -r function.zip index.mjs

# Deploy to AWS
aws lambda update-function-code \
  --function-name SearchProducts \
  --zip-file fileb://function.zip \
  --region ap-south-1

# Verify deployment
aws lambda get-function \
  --function-name SearchProducts \
  --region ap-south-1 \
  --query 'Configuration.{State:State,LastModified:LastModified}'
```

### Deploy All Functions at Once

```bash
#!/bin/bash
REGION="ap-south-1"
FUNCTIONS=("SearchProducts" "GetProduct" "GetFeaturedProducts" "GetRecommendations" "LogUserActivity")

for FUNC in "${FUNCTIONS[@]}"; do
  echo "Deploying $FUNC..."
  cd "backend/lambda-functions/$FUNC"
  zip -r function.zip index.mjs
  aws lambda update-function-code \
    --function-name "$FUNC" \
    --zip-file fileb://function.zip \
    --region "$REGION"
  rm function.zip
  cd ../../..
  echo "✅ $FUNC deployed"
done
echo "All functions deployed!"
```

---

## 🐛 Debugging Common Errors

### 502 Bad Gateway

Lambda returned an invalid response or crashed. Check:

1. CloudWatch Logs → `/aws/lambda/[FunctionName]` — look for unhandled exceptions
2. Verify every code path returns a valid object with `statusCode`, `headers`, and `body`
3. Ensure `body` is always a JSON string (`JSON.stringify(...)`)

### AccessDeniedException

Lambda role is missing a DynamoDB permission. Fix:

1. Lambda → Configuration → Permissions → Click role name
2. Add permissions → Attach `AmazonDynamoDBReadOnlyAccess` or custom inline policy

### CORS Error in Browser

OPTIONS preflight is failing. Fix:

1. API Gateway → Resource → Actions → Enable CORS
2. Verify OPTIONS method exists on the resource
3. **Redeploy the API** (Actions → Deploy API → prod)

### Empty Recommendations

GetRecommendations returns `count: 0`. Check:

1. UserActivity table has data for the test user_id
2. Products table has items in the categories the user browsed
3. Lambda CloudWatch logs show the categories found
4. CategoryIndex GSI exists on Products table

---

## 📊 Monitoring

### CloudWatch Alarms (one per function)

Each function has a CloudWatch alarm that sends an SNS email notification when errors >= 1 in a 5-minute window.

| Alarm | Lambda | Metric | Threshold |
|-------|--------|--------|-----------|
| SearchProducts-Errors | SearchProducts | Errors | >= 1 |
| GetProduct-Errors | GetProduct | Errors | >= 1 |
| GetFeaturedProducts-Errors | GetFeaturedProducts | Errors | >= 1 |
| GetRecommendations-Errors | GetRecommendations | Errors | >= 1 |
| LogUserActivity-Errors | LogUserActivity | Errors | >= 1 |

### SNS Topic

**Name:** `ecommerce-lambda-alerts`
**Protocol:** Email
**Region:** `ap-south-1`

### Viewing Logs

```bash
# Stream latest logs for any function
aws logs tail /aws/lambda/GetRecommendations --follow --region ap-south-1

# View logs for a specific time window
aws logs filter-log-events \
  --log-group-name /aws/lambda/LogUserActivity \
  --start-time $(date -d '1 hour ago' +%s000) \
  --region ap-south-1
```

---

## 🔗 DynamoDB Tables Reference

| Table | Used By |
|-------|---------|
| Products | SearchProducts, GetProduct, GetFeaturedProducts, GetRecommendations |
| UserActivity | GetRecommendations (read), LogUserActivity (write) |
| RecommendationCache | GetRecommendations (read/write, optional caching) |

**GSIs on Products:**
- `CategoryIndex` — PK: category, SK: popularity_score
- `VendorIndex` — PK: vendor_id, SK: created_at
- `PopularityIndex` — PK: category, SK: sales_count

**GSI on UserActivity:**
- `ProductActivityIndex` — PK: product_id, SK: timestamp