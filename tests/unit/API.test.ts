import { API } from '../../src/API';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock fetch
global.fetch = jest.fn();

describe('API', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    (global.fetch as jest.Mock).mockClear();
    
    // Reset static properties
    (API as any).baseUrl = "https://api.example.com";
    (API as any).token = null;
  });

  describe('setBaseUrl', () => {
    test('should set base URL', () => {
      API.setBaseUrl('https://new-api.com');
      
      expect((API as any).baseUrl).toBe('https://new-api.com');
    });
  });

  describe('setToken', () => {
    test('should set token and store in localStorage', () => {
      const token = 'test-token-123';
      
      const result = API.setToken(token);
      
      expect((API as any).token).toBe(token);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', token);
      expect(result).toBe(API); // Should return API for chaining
    });

    test('should support method chaining', () => {
      const result = API.setToken('token1').setToken('token2');
      
      expect(result).toBe(API);
      expect((API as any).token).toBe('token2');
    });
  });

  describe('getToken', () => {
    test('should return token from memory when available', () => {
      (API as any).token = 'memory-token';
      
      const token = API.getToken();
      
      expect(token).toBe('memory-token');
      expect(localStorageMock.getItem).not.toHaveBeenCalled();
    });

    test('should get token from localStorage when not in memory', () => {
      (API as any).token = null;
      localStorageMock.getItem.mockReturnValue('localStorage-token');
      
      const token = API.getToken();
      
      expect(token).toBe('localStorage-token');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
      expect((API as any).token).toBe('localStorage-token');
    });

    test('should return null when no token available', () => {
      (API as any).token = null;
      localStorageMock.getItem.mockReturnValue(null);
      
      const token = API.getToken();
      
      expect(token).toBeNull();
    });
  });

  describe('request', () => {
    test('should make GET request without token', async () => {
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await (API as any).request('/test', 'GET');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          body: undefined
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should make POST request with body', async () => {
      const mockResponse = { success: true };
      const requestBody = { name: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await (API as any).request('/test', 'POST', requestBody);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include Authorization header when token is available', async () => {
      (API as any).token = 'test-token';
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await (API as any).request('/test', 'GET');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          },
          body: undefined
        }
      );
    });

    test('should throw error when response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect((API as any).request('/test', 'GET'))
        .rejects
        .toThrow('API error: 404');
    });

    test('should handle different status codes', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect((API as any).request('/test', 'GET'))
        .rejects
        .toThrow('API error: 500');
    });
  });

  describe('get', () => {
    test('should make GET request', async () => {
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await API.get('/users');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          body: undefined
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle generic type', async () => {
      interface User {
        id: number;
        name: string;
      }
      
      const mockUser: User = { id: 1, name: 'John' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      const result = await API.get<User>('/users/1');

      expect(result).toEqual(mockUser);
    });
  });

  describe('post', () => {
    test('should make POST request with data', async () => {
      const mockResponse = { success: true };
      const postData = { name: 'John', email: 'john@example.com' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await API.post('/users', postData);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle generic type', async () => {
      interface CreateUserResponse {
        id: number;
        message: string;
      }
      
      const mockResponse: CreateUserResponse = { id: 123, message: 'User created' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await API.post<CreateUserResponse>('/users', { name: 'John' });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    test('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(API.get('/test'))
        .rejects
        .toThrow('Network error');
    });

    test('should handle JSON parsing errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      await expect(API.get('/test'))
        .rejects
        .toThrow('Invalid JSON');
    });
  });

  describe('integration scenarios', () => {
    test('should work with token flow', async () => {
      // Set token
      API.setToken('auth-token');
      
      // Make request
      const mockResponse = { data: 'protected data' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await API.get('/protected');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/protected',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer auth-token'
          },
          body: undefined
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('should work with different base URLs', async () => {
      API.setBaseUrl('https://custom-api.com');
      
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await API.get('/endpoint');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://custom-api.com/endpoint',
        expect.any(Object)
      );
    });
  });
});
