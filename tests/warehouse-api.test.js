
// Test cases for Warehouse API
// These can be run with Jest or similar testing framework

const API_BASE_URL = 'https://ntctmdwxyjnxconnsirk.supabase.co/functions/v1';

describe('Warehouse API Tests', () => {
  
  describe('Goods Management', () => {
    test('GET /warehouse-api/goods - should return all goods', async () => {
      const response = await fetch(`${API_BASE_URL}/warehouse-api/goods`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('POST /warehouse-api/goods - should create new goods', async () => {
      const newGoods = {
        item_name: 'Test Package',
        quantity: 2,
        location: 'Test Bay A',
        camera_id: 'CAM-001',
        confidence_score: 95.5
      };

      const response = await fetch(`${API_BASE_URL}/warehouse-api/goods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGoods)
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.item_name).toBe(newGoods.item_name);
      expect(data.quantity).toBe(newGoods.quantity);
    });

    test('POST /warehouse-api/goods - should validate required fields', async () => {
      const invalidGoods = {
        quantity: 1
        // Missing required fields: item_name, location
      };

      const response = await fetch(`${API_BASE_URL}/warehouse-api/goods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidGoods)
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Vehicle Management', () => {
    test('GET /warehouse-api/vehicles - should return all vehicles', async () => {
      const response = await fetch(`${API_BASE_URL}/warehouse-api/vehicles`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('POST /warehouse-api/vehicles - should create new vehicle', async () => {
      const newVehicle = {
        license_plate: 'TEST-123',
        vehicle_type: 'truck',
        location: 'Gate A',
        camera_id: 'CAM-002',
        confidence_score: 98.2
      };

      const response = await fetch(`${API_BASE_URL}/warehouse-api/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVehicle)
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.license_plate).toBe(newVehicle.license_plate);
      expect(data.vehicle_type).toBe(newVehicle.vehicle_type);
    });
  });

  describe('Alert Management', () => {
    test('POST /warehouse-api/alerts - should create new alert', async () => {
      const newAlert = {
        alert_type: 'warning',
        title: 'Test Alert',
        description: 'This is a test alert',
        camera_id: 'CAM-003',
        location: 'Storage Zone B'
      };

      const response = await fetch(`${API_BASE_URL}/warehouse-api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlert)
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.title).toBe(newAlert.title);
      expect(data.alert_type).toBe(newAlert.alert_type);
    });
  });

  describe('Analytics', () => {
    test('GET /warehouse-api/analytics/throughput - should return throughput data', async () => {
      const response = await fetch(`${API_BASE_URL}/warehouse-api/analytics/throughput`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('GET /warehouse-api/analytics/accuracy - should return accuracy data', async () => {
      const response = await fetch(`${API_BASE_URL}/warehouse-api/analytics/accuracy`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('Simulation', () => {
    test('POST /warehouse-api/simulate-data - should generate simulation data', async () => {
      const response = await fetch(`${API_BASE_URL}/warehouse-api/simulate-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Simulation data added successfully');
    });
  });

  describe('Error Handling', () => {
    test('GET /warehouse-api/nonexistent - should return 404', async () => {
      const response = await fetch(`${API_BASE_URL}/warehouse-api/nonexistent`);
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Not Found');
    });

    test('POST with invalid JSON - should return 400', async () => {
      const response = await fetch(`${API_BASE_URL}/warehouse-api/goods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json'
      });

      expect(response.status).toBe(400);
    });
  });
});
