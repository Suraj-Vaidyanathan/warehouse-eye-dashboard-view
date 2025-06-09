
# Warehouse API Testing Guide

## Overview
This guide covers testing the Warehouse Management System API using the provided test cases and Postman collection.

## API Base URL
```
https://ntctmdwxyjnxconnsirk.supabase.co/functions/v1/warehouse-api
```

## Test Cases

### 1. Goods Management
- **GET /goods** - Retrieve all goods
- **POST /goods** - Create new goods entry

### 2. Vehicle Management  
- **GET /vehicles** - Retrieve all vehicles
- **POST /vehicles** - Create new vehicle entry

### 3. Alert Management
- **POST /alerts** - Create system alerts

### 4. Analytics
- **GET /analytics/{type}** - Get analytics data by type
  - Types: throughput, accuracy, vehicles, goods

### 5. Simulation
- **POST /simulate-data** - Generate test data

## Running Tests

### Using Jest (Node.js)
1. Install dependencies:
```bash
npm install jest node-fetch
```

2. Add to package.json:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

3. Run tests:
```bash
npm test
```

### Using Postman
1. Import the collection file: `postman/warehouse-api-collection.json`
2. Set the environment variable `baseUrl` to your API endpoint
3. Run individual requests or the entire collection

## Sample Requests

### Create Goods
```json
POST /warehouse-api/goods
{
  "item_name": "Sample Package",
  "quantity": 3,
  "location": "Receiving Bay A",
  "camera_id": "CAM-001",
  "confidence_score": 95.8
}
```

### Create Vehicle
```json
POST /warehouse-api/vehicles
{
  "license_plate": "ABC-123",
  "vehicle_type": "truck",
  "location": "Gate A",
  "camera_id": "CAM-002",
  "confidence_score": 97.2
}
```

### Create Alert
```json
POST /warehouse-api/alerts
{
  "alert_type": "warning",
  "title": "Low Detection Accuracy",
  "description": "Camera accuracy dropped below threshold",
  "camera_id": "CAM-003",
  "location": "Storage Zone B"
}
```

## Expected Responses

### Success Response (201 Created)
```json
{
  "id": "uuid-here",
  "item_name": "Sample Package",
  "quantity": 3,
  "location": "Receiving Bay A",
  "status": "in_transit",
  "detected_at": "2024-01-01T10:00:00Z",
  "created_at": "2024-01-01T10:00:00Z"
}
```

### Error Response (400 Bad Request)
```json
{
  "error": "Missing required field: item_name"
}
```

### Error Response (404 Not Found)
```json
{
  "error": "Not Found"
}
```

## Testing Checklist

- [ ] All GET endpoints return 200 status
- [ ] All POST endpoints return 201 status with valid data
- [ ] Invalid requests return appropriate error codes
- [ ] Response data includes all expected fields
- [ ] Real-time updates work (check dashboard after API calls)
- [ ] Simulation endpoint generates random data
- [ ] Analytics endpoints return time-series data
- [ ] CORS headers are present in responses
