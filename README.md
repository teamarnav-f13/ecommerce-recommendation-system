# 🛒 ShopSmart — AI-Powered E-Commerce Platform

> A fully serverless, AI-driven e-commerce platform built on AWS featuring real-time personalized recommendations, intelligent product search, and live user behavior tracking.

---

## 🌐 Live Demo

**Website:** [https://main.d2pqxft7xv5fa4.amplifyapp.com](https://main.d2pqxft7xv5fa4.amplifyapp.com)

**API Base URL:** `https://b6yga2ffv8.execute-api.ap-south-1.amazonaws.com/prod`

**AWS Region:** `ap-south-1` (Mumbai)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [AWS Services](#aws-services)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Frontend Components](#frontend-components)
- [Recommendation Engine](#recommendation-engine)
- [Activity Tracking](#activity-tracking)
- [Setup and Deployment](#setup-and-deployment)
- [Environment Variables](#environment-variables)
- [Monitoring and Alerts](#monitoring-and-alerts)
- [Data Summary](#data-summary)
- [Testing](#testing)

---

## 📖 Overview

ShopSmart is a production-ready, fully serverless e-commerce platform that demonstrates modern AWS architecture. It uses behavioral analysis to track user interactions — product views, cart additions, and purchases — and delivers personalized product recommendations in real time through a React frontend hosted on AWS Amplify.

The recommendation engine analyzes each user's browsing and purchase history against the shared UserActivity table, applies a weighted scoring formula, and returns ranked results through a dedicated Lambda function. Every user action on the site is immediately logged to DynamoDB, so recommendations improve the more users interact with the platform.

### Project Stats

| Metric | Value |
|--------|-------|
| Products in catalog | 1,000 across 8 categories |
| Authenticated users | 10 (AWS Cognito) |
| Tracked activity events | 5,073+ |
| Lambda functions | 5 |
| REST API endpoints | 5 |
| DynamoDB tables | 3 (with 4 GSIs) |
| Hosting | AWS Amplify (CI/CD from GitHub) |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                 END USERS (Browser)                   │
└─────────────────────┬────────────────────────────────┘
                      │ HTTPS
                      ▼
┌──────────────────────────────────────────────────────┐
│             AWS COGNITO USER POOL                     │
│         JWT Authentication · 10 Real Users            │
└─────────────────────┬────────────────────────────────┘
                      │ JWT Token
                      ▼
┌──────────────────────────────────────────────────────┐
│                 AWS AMPLIFY                           │
│           React 19 SPA (Vite build)                  │
│   Search · Products · Cart · Recommendations          │
│   GitHub CI/CD — auto-deploy on every push           │
└─────────────────────┬────────────────────────────────┘
                      │ REST API calls
                      ▼
┌──────────────────────────────────────────────────────┐
│          AWS API GATEWAY  (REST API, Stage: prod)     │
│  /search   /products/{id}   /featured                │
│  /recommendations            /activity               │
└───┬──────────┬────────────┬────────────┬─────────────┘
    │          │            │            │
    ▼          ▼            ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────────┐ ┌───────────────────┐
│ Search │ │GetProd │ │Featured│ │GetRecommendations│ │ LogUserActivity   │
│ Lambda │ │ Lambda │ │ Lambda │ │ Lambda (512 MB)  │ │ Lambda (128 MB)   │
└───┬────┘ └───┬────┘ └───┬────┘ └────────┬─────────┘ └────────┬──────────┘
    │          │          │               │                     │
    └──────────┴──────────┴───────────────┴─────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────┐
│                 AMAZON DYNAMODB                       │
│   Products Table · UserActivity Table · Cache Table  │
│   On-demand billing · GSIs for fast queries          │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│           CLOUDWATCH  +  SNS ALERTS                   │
│  Lambda metrics · API logs · Email error alerts       │
└──────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Search and Discovery
- Full-text keyword search across product name, description, brand, and category
- Filter by category, price range, and vendor
- Sort by popularity, price (asc/desc), rating, or newest
- Paginated results (20 per page default)

### AI Recommendation Engine — 5 Strategies
- **Personalized** — analyzes individual browsing and purchase history
- **Frequently Bought Together** — co-purchase pattern analysis
- **Users Also Viewed** — collaborative filtering across sessions
- **Category-Based Similar** — content similarity scoring (subcategory, brand, price range)
- **Cold-Start Popular** — bestsellers fallback for new or unrecognized users

### Shopping Experience
- AWS Cognito sign up / sign in / sign out with branded UI
- Persistent shopping cart via localStorage
- Real-time cart count badge that updates instantly on add and remove
- Multi-image product gallery with thumbnail navigation
- In-stock / low-stock / out-of-stock status indicators
- Quantity selector with min/max validation
- Order summary with tax (10%) and free shipping threshold ($50)

### Live User Activity Tracking
- Product views logged to DynamoDB when a user opens a product page
- Add-to-cart events logged on every cart addition (from card or product page)
- Purchase events logged on checkout completion
- Recommendations update automatically as new activity accumulates

### Monitoring and Alerts
- CloudWatch logs enabled for all Lambda functions
- SNS email alerts fire when any Lambda has errors
- CloudWatch dashboard for invocation counts, error rates, and duration

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI component framework |
| Vite | 5.x | Build tool and dev server |
| React Router | 6.x | Client-side routing |
| AWS Amplify UI | 6.x | Cognito authenticator components |
| Lucide React | 0.x | Icon library |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 24.x | Lambda runtime |
| AWS SDK v3 | 3.x | DynamoDB document client |
| AWS Lambda | — | Serverless compute |
| API Gateway | REST | HTTP routing to Lambdas |

### AWS Infrastructure

| Service | Role |
|---------|------|
| AWS Amplify | Frontend hosting with GitHub CI/CD |
| AWS Cognito | User pool, JWT generation and validation |
| API Gateway | REST API with CORS, routing, and optional authorization |
| AWS Lambda | All backend logic (5 functions) |
| Amazon DynamoDB | NoSQL database (3 tables, on-demand billing) |
| Amazon S3 | Product image storage (optional, Unsplash used in dev) |
| CloudWatch | Logs, metrics, and dashboards |
| Amazon SNS | Error alert email notifications |

---

## 📁 Project Structure

```
ecommerce-recommendation-system/
│
├── frontend/                            # React SPA
│   ├── index.html                       # HTML template, browser tab title
│   ├── vite.config.js                   # Vite configuration
│   ├── package.json
│   └── src/
│       ├── main.jsx                     # React DOM entry point
│       ├── App.jsx                      # Root component, Cognito Authenticator wrapper
│       ├── components/
│       │   ├── common/
│       │   │   ├── Header.jsx           # Navigation, search bar, live cart badge
│       │   │   ├── Footer.jsx           # Site footer with links
│       │   │   └── SearchBar.jsx        # Search input with navigation
│       │   ├── products/
│       │   │   ├── ProductCard.jsx      # Grid card — logs add_to_cart to DynamoDB
│       │   │   ├── ProductGrid.jsx      # Responsive 2-column grid layout
│       │   │   └── Filters.jsx          # Category, price, vendor filter panel
│       │   └── recommendations/
│       │       ├── RecommendedProducts.jsx   # Personalized section on homepage
│       │       ├── FrequentlyBought.jsx      # Bought together on product page
│       │       └── SimilarProducts.jsx       # Similar products on product page
│       ├── pages/
│       │   ├── Home.jsx                 # Hero + featured products + recommendations
│       │   ├── SearchResults.jsx        # Filter panel + paginated product grid
│       │   ├── ProductPage.jsx          # Full product detail — logs views to DynamoDB
│       │   └── Cart.jsx                 # Cart items, quantity controls, order summary
│       ├── services/
│       │   └── api.js                   # productAPI, activityAPI, recommendationAPI
│       ├── hooks/
│       │   └── useProducts.js           # Custom React hooks for product fetching
│       └── styles/
│           └── App.css                  # Global styles, CSS variables, component styles
│
├── backend/
│   ├── lambda-functions/                # All Lambda source code
│   │   ├── SearchProducts/
│   │   │   └── index.mjs
│   │   ├── GetProduct/
│   │   │   └── index.mjs
│   │   ├── GetFeaturedProducts/
│   │   │   └── index.mjs
│   │   ├── GetRecommendations/
│   │   │   └── index.mjs
│   │   ├── LogUserActivity/
│   │   │   └── index.mjs
│   │   └── README.md                    # Lambda-specific documentation
│   └── scripts/
│       ├── generate_products.py         # Generates 1,000 DynamoDB product records
│       ├── generate_activity.py         # Generates 5,000+ UserActivity events
│       └── update_images.py            # Updates product image URLs to S3
│
├── docs/
│   └── architecture-diagram.png        # AWS architecture diagram
│
├── amplify.yml                          # Amplify CI/CD build config
├── .gitignore
└── README.md                            # This file
```

---

## ☁️ AWS Services

### Lambda Function Configuration

| Function | Memory | Timeout | API Trigger | DynamoDB Access |
|----------|--------|---------|-------------|----------------|
| SearchProducts | 256 MB | 30s | GET /search | Products (Query, Scan) |
| GetProduct | 128 MB | 10s | GET /products/{id} | Products (GetItem) |
| GetFeaturedProducts | 256 MB | 15s | GET /featured | Products (Query, Scan) |
| GetRecommendations | 512 MB | 30s | GET /recommendations | Products + UserActivity (Query, Scan, GetItem) |
| LogUserActivity | 128 MB | 10s | POST /activity | UserActivity (PutItem) |

### API Gateway Configuration

| Resource | Method | Integration | Authorization | CORS |
|----------|--------|-------------|---------------|------|
| /search | GET | SearchProducts Lambda | None | Enabled |
| /products/{productId} | GET | GetProduct Lambda | None | Enabled |
| /featured | GET | GetFeaturedProducts Lambda | None | Enabled |
| /recommendations | GET | GetRecommendations Lambda | None | Enabled |
| /activity | POST | LogUserActivity Lambda | None | Enabled |

---

## 🗄️ Database Schema

### Products Table

**Primary Key:** `product_id` (String)

| Attribute | Type | Description |
|-----------|------|-------------|
| product_id | String | Unique ID e.g. PROD-00001 |
| product_name | String | Display name |
| description | String | Full product description |
| category | String | One of 8 categories |
| subcategory | String | Sub-category within category |
| brand | String | Brand/manufacturer name |
| price | Number | Current selling price |
| original_price | Number | Pre-discount price |
| discount_percentage | Number | Discount percentage (0–100) |
| images | List | Array of 5 image URLs |
| rating | Number | Average rating (0–5) |
| review_count | Number | Total number of reviews |
| sales_count | Number | Units sold |
| stock_quantity | Number | Available units |
| popularity_score | Number | Computed score for ranking |
| is_featured | Boolean | Display on homepage |
| is_bestseller | Boolean | Show bestseller badge |
| is_in_stock | Boolean | Derived from stock_quantity |
| vendor_id | String | e.g. VENDOR-001 |
| vendor_name | String | Seller display name |
| tags | List | Keyword tags array |
| created_at | String | ISO 8601 timestamp |
| updated_at | String | ISO 8601 timestamp |

**Global Secondary Indexes:**

| GSI | Partition Key | Sort Key | Used For |
|-----|--------------|----------|----------|
| CategoryIndex | category | popularity_score | Category browsing + sorting |
| VendorIndex | vendor_id | created_at | Vendor product listings |
| PopularityIndex | category | sales_count | Bestsellers per category |

---

### UserActivity Table

**Primary Key:** `user_id` (String) + `timestamp` (String — Sort Key)

| Attribute | Type | Description |
|-----------|------|-------------|
| user_id | String | Cognito sub ID |
| timestamp | String | ISO 8601 event time |
| product_id | String | Product interacted with |
| event_type | String | view / add_to_cart / purchase |
| session_id | String | Browser session identifier |
| quantity | Number | (Optional) units added or purchased |
| order_id | String | (Optional) for purchase events |

**GSI:**

| GSI | Partition Key | Sort Key | Used For |
|-----|--------------|----------|----------|
| ProductActivityIndex | product_id | timestamp | Find all users who interacted with a product |

---

### RecommendationCache Table

**Primary Key:** `cache_key` (String)

| Attribute | Type | Description |
|-----------|------|-------------|
| cache_key | String | e.g. `user:81231d3a-...` |
| recommendations | List | Pre-computed product array |
| strategy | String | Algorithm strategy used |
| ttl | Number | Unix timestamp for auto-expiry |
| created_at | String | ISO 8601 timestamp |

---

## 🔗 API Reference

**Base URL:** `https://b6yga2ffv8.execute-api.ap-south-1.amazonaws.com/prod`

---

### GET /search

Search and filter products.

**Query parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| q | string | No | Keyword search term |
| category | string | No | Category name |
| minPrice | number | No | Minimum price |
| maxPrice | number | No | Maximum price |
| vendor | string | No | Vendor/seller name |
| sortBy | string | No | `price_asc` `price_desc` `popularity` `rating` `newest` |
| page | number | No | Page number (default: 1) |
| limit | number | No | Results per page (default: 20) |

```bash
curl "...prod/search?q=headphones&category=Electronics&sortBy=rating&limit=10"
```

---

### GET /products/{productId}

Fetch a single product by ID.

```bash
curl "...prod/products/PROD-00001"
```

**Response:**
```json
{ "product": { "product_id": "PROD-00001", "product_name": "...", "price": 89.99 } }
```

---

### GET /featured

Fetch featured/popular products.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 12 | Number of products |

```bash
curl "...prod/featured?limit=12"
```

---

### GET /recommendations

Fetch AI-powered recommendations. All parameters are optional — the Lambda selects the best strategy based on what is provided.

| Param | Type | Description |
|-------|------|-------------|
| user_id | string | Cognito sub ID — triggers personalized strategy |
| product_id | string | Product ID — triggers product-based strategies |
| type | string | `frequently-bought` `similar` `also-viewed` |
| limit | number | Number of results (default: 8) |

```bash
# Personalized
curl "...prod/recommendations?user_id=81231d3a-...&limit=8"

# Frequently bought together
curl "...prod/recommendations?product_id=PROD-00001&type=frequently-bought&limit=4"

# Similar products
curl "...prod/recommendations?product_id=PROD-00001&type=similar&limit=8"
```

**Response:**
```json
{
  "recommendations": [ { "product_id": "PROD-00042", "product_name": "..." } ],
  "strategy": "personalized_user_based",
  "count": 8,
  "type": "general"
}
```

---

### POST /activity

Log a user interaction to DynamoDB.

**Request body:**
```json
{
  "user_id": "81231d3a-a0d1-7027-e3ea-8f912b363db5",
  "product_id": "PROD-00001",
  "event_type": "view",
  "quantity": 1,
  "session_id": "session-1708163400-abc123"
}
```

Valid `event_type` values: `view`, `add_to_cart`, `purchase`

```bash
curl -X POST "...prod/activity" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"...","product_id":"PROD-00001","event_type":"view"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Activity logged successfully",
  "activity": {
    "user_id": "...",
    "product_id": "PROD-00001",
    "event_type": "view",
    "timestamp": "2026-02-17T10:30:00.123Z"
  }
}
```

---

## 🧩 Frontend Components

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero banner + featured products + "Recommended For You" |
| Search Results | `/search` | Filter sidebar + paginated product grid |
| Product Detail | `/product/:id` | Gallery, product info, Frequently Bought + Similar sections |
| Cart | `/cart` | Item list, quantity controls, order summary, checkout button |

### Key Component Details

**Header.jsx**
- Listens for `cart-updated` window events to update badge in real time
- Also listens for `storage` events to sync across browser tabs
- Shows cart item count as total quantity (not unique products)
- Displays authenticated user's email and sign-out button

**ProductCard.jsx**
- Add to Cart: saves item to localStorage, dispatches `cart-updated` event, and calls `activityAPI.logAddToCart()` to write to DynamoDB
- Clicking the card or product name navigates to the product detail page

**ProductPage.jsx**
- On mount, calls `activityAPI.logView()` — fires POST /activity with `event_type: "view"`
- Add to Cart: calls `activityAPI.logAddToCart()` before saving to localStorage
- Buy Now: adds to cart then navigates to `/cart`
- Bottom section renders `FrequentlyBought` and `SimilarProducts` components

**RecommendedProducts.jsx**
- Accepts `userId` prop from Home.jsx
- Calls `recommendationAPI.getRecommendations({ user_id, limit: 8 })`
- Shows loading spinner, renders product cards, returns null silently on error or empty

**api.js — Three exported objects:**

```javascript
productAPI.search(params)           // GET /search
productAPI.getProduct(id)           // GET /products/{id}
productAPI.getFeatured(limit)       // GET /featured

activityAPI.logView(productId, userId)
activityAPI.logAddToCart(productId, userId, quantity)
activityAPI.logPurchase(productId, userId, quantity, orderId)

recommendationAPI.getRecommendations(params)
recommendationAPI.getFrequentlyBought(productId)
recommendationAPI.getSimilarProducts(productId)
recommendationAPI.getUsersAlsoViewed(productId)
```

---

## 🤖 Recommendation Engine

The `GetRecommendations` Lambda selects one of 5 strategies based on the incoming query parameters.

### Strategy Selection

```
user_id provided              → Personalized User-Based
product_id + frequently-bought → Frequently Bought Together
product_id + similar           → Category-Based Similar
product_id + also-viewed       → Users Also Viewed
no parameters / new user       → Cold-Start Popular Products
```

### Weighted Scoring Formula

Applied at the end of every strategy before returning results:

```
score = (popularity_score × 0.4) + ((rating ÷ 5 × 100) × 0.3) + ((sales_count ÷ 10) × 0.3)
```

### Strategy Descriptions

**Personalized User-Based**
Queries UserActivity for the user's last 50 events, extracts the viewed product IDs, fetches those products to discover preferred categories, then queries CategoryIndex GSI for new products in those categories — filtering out anything the user has already seen.

**Frequently Bought Together**
Queries ProductActivityIndex for purchase events on the target product, gets the buying users, finds all other products those users purchased, counts co-purchase frequency, and returns the most commonly co-bought items.

**Category-Based Similar**
Queries the same category as the target product, scores each candidate by subcategory match (+3), brand match (+2), and price within 30% (+1), then combines with the weighted score formula.

**Users Also Viewed**
Queries ProductActivityIndex for view events, identifies users who viewed the target product, finds all other products those users viewed in the same session, and returns the top co-viewed items.

**Cold-Start Popular**
Scans the Products table for items where `is_featured = true` OR `is_bestseller = true` OR `popularity_score > 60`, sorts by popularity descending, and returns the top N.

---

## 📡 Activity Tracking

Every user interaction is written to DynamoDB in real time, enabling the recommendation engine to learn from live behavior.

### Event Flow

```
User opens product page
  ↓ ProductPage useEffect fires on mount
  ↓ activityAPI.logView(productId, userId)
  ↓ POST /activity → LogUserActivity Lambda
  ↓ PutItem into UserActivity table
  ↓ New row visible in DynamoDB immediately

User clicks Add to Cart
  ↓ ProductCard handleAddToCart fires
  ↓ activityAPI.logAddToCart(productId, userId, quantity)
  ↓ POST /activity → LogUserActivity Lambda
  ↓ PutItem into UserActivity table

Next recommendation request for this user
  ↓ GetRecommendations queries UserActivity
  ↓ Sees fresh events including today's activity
  ↓ Returns updated personalized recommendations
```

### Session Tracking

Each browser session gets a unique `session_id` generated and stored in `sessionStorage`:
```
session-{timestamp}-{randomString}
e.g. session-1708163400-abc123def
```

This enables session-level co-occurrence analysis used by the "Users Also Viewed" strategy.

---

## 🚀 Setup and Deployment

### Prerequisites

- Node.js 18+
- Python 3.8+ with `boto3`
- AWS CLI (`aws configure` completed)
- AWS account with access to Lambda, DynamoDB, API Gateway, Cognito, Amplify

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-recommendation-system.git
cd ecommerce-recommendation-system
```

### 2. Frontend Local Development

```bash
cd frontend
npm install

# Create environment file
echo "VITE_API_URL=https://b6yga2ffv8.execute-api.ap-south-1.amazonaws.com/prod" > .env

npm run dev
# App opens at http://localhost:5173
```

### 3. Generate Sample Data

```bash
cd backend/scripts
pip install boto3

python generate_products.py   # Creates 1,000 products in DynamoDB
python generate_activity.py   # Creates 5,000+ activity events for 10 users
```

### 4. Deploy Lambda Functions

```bash
# Example — repeat for each function
cd backend/lambda-functions/LogUserActivity
zip -r function.zip index.mjs

aws lambda update-function-code \
  --function-name LogUserActivity \
  --zip-file fileb://function.zip \
  --region ap-south-1
```

### 5. Deploy to Amplify

1. AWS Amplify Console → Host Web App → Connect GitHub
2. Select your repository and `main` branch
3. Amplify auto-detects Vite settings
4. Add environment variable: `VITE_API_URL`
5. Save and deploy

Every `git push origin main` triggers automatic redeploy via `amplify.yml`.

---

## 🔧 Environment Variables

### Frontend — `frontend/.env`

```env
VITE_API_URL=https://b6yga2ffv8.execute-api.ap-south-1.amazonaws.com/prod
```

### Lambda — AWS Console → Configuration → Environment Variables

```
PRODUCTS_TABLE        = Products
USERACTIVITY_TABLE    = UserActivity
CACHE_TABLE           = RecommendationCache
REGION                = ap-south-1
```

---

## 📊 Monitoring and Alerts

### CloudWatch Alarms

| Alarm | Lambda | Threshold | Notification |
|-------|--------|-----------|-------------|
| SearchProducts-Errors | SearchProducts | ≥ 1 error per 5 min | SNS email |
| GetProduct-Errors | GetProduct | ≥ 1 error per 5 min | SNS email |
| GetFeaturedProducts-Errors | GetFeaturedProducts | ≥ 1 error per 5 min | SNS email |
| GetRecommendations-Errors | GetRecommendations | ≥ 1 error per 5 min | SNS email |
| LogUserActivity-Errors | LogUserActivity | ≥ 1 error per 5 min | SNS email |

### SNS Alert Topic

**Name:** `ecommerce-lambda-alerts`
**Region:** `ap-south-1`
**Protocol:** Email subscription (confirmed at setup)

### CloudWatch Dashboard: `EcommerceDashboard`

- Lambda invocations per function (line chart)
- Lambda errors per function (line chart)
- Lambda average duration per function (line chart)
- API Gateway request count (number widget)
- DynamoDB consumed read capacity (line chart)

---

## 📈 Data Summary

### Products by Category

| Category | Count |
|----------|-------|
| Electronics | ~125 |
| Clothing | ~125 |
| Home and Garden | ~125 |
| Sports and Outdoors | ~125 |
| Books | ~125 |
| Toys and Games | ~125 |
| Automotive | ~125 |
| Health and Beauty | ~125 |

### Activity Events

| Event Type | Count |
|------------|-------|
| View | ~4,629 |
| Add to Cart | ~700 |
| Purchase | ~285 |
| Total | 5,073+ |

### Cognito Test Users

| Username | Email |
|----------|-------|
| raj | raj@example.com |
| nidhi | nidhi@example.com |
| customer1–8 | customer1@example.com … customer8@example.com |
| naveen | naveen@example.com |

---

## 🧪 Testing

### Lambda Test Events

**SearchProducts:**
```json
{
  "queryStringParameters": {
    "q": "laptop",
    "category": "Electronics",
    "limit": "10"
  }
}
```

**GetRecommendations:**
```json
{
  "queryStringParameters": {
    "user_id": "81231d3a-a0d1-7027-e3ea-8f912b363db5",
    "limit": "8"
  }
}
```

**LogUserActivity:**
```json
{
  "body": "{\"user_id\":\"81231d3a-a0d1-7027-e3ea-8f912b363db5\",\"product_id\":\"PROD-00001\",\"event_type\":\"view\",\"session_id\":\"test-session\"}",
  "requestContext": { "httpMethod": "POST" }
}
```

### API Curl Tests

```bash
BASE="https://b6yga2ffv8.execute-api.ap-south-1.amazonaws.com/prod"
USER="81231d3a-a0d1-7027-e3ea-8f912b363db5"

# Search
curl "$BASE/search?q=laptop&limit=5"

# Featured products
curl "$BASE/featured?limit=6"

# Single product
curl "$BASE/products/PROD-00001"

# Personalized recommendations
curl "$BASE/recommendations?user_id=$USER&limit=8"

# Log a view event
curl -X POST "$BASE/activity" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"$USER\",\"product_id\":\"PROD-00001\",\"event_type\":\"view\"}"
```

---

## 🔗 Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Amazon DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
- [API Gateway REST API Guide](https://docs.aws.amazon.com/apigateway/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Amazon Cognito Documentation](https://docs.aws.amazon.com/cognito/)
