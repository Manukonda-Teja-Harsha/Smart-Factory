import unittest
from fastapi.testclient import TestClient

from backend.main import app


class ApiEndpointTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint_is_available(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload['status'], 'ok')
        self.assertIn('services', payload)

    def test_login_endpoint_accepts_demo_credentials(self):
        response = self.client.post('/api/auth/login', json={
            'email': 'admin@smartfactory.com',
            'password': 'Admin@123'
        })
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn('access_token', payload)
        self.assertEqual(payload['user']['email'], 'admin@smartfactory.com')


if __name__ == '__main__':
    unittest.main()
