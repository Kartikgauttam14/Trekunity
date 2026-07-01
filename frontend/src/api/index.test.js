import { describe, it, expect, vi } from 'vitest';

// Set up mock browser globals immediately before any ESM imports are processed
globalThis.localStorage = {
    getItem: vi.fn(() => 'mock-token'),
    setItem: vi.fn(),
    removeItem: vi.fn(),
};

globalThis.window = {
    location: {
        protocol: 'http:',
        href: '',
    },
};

vi.mock('axios', () => {
    return {
        default: {
            create: vi.fn(() => ({
                interceptors: {
                    request: { use: vi.fn() },
                    response: { use: vi.fn() },
                },
                post: vi.fn().mockResolvedValue({ data: { success: true } }),
                get: vi.fn().mockResolvedValue({ data: [{ id: '1' }] }),
            })),
        },
    };
});

describe('Frontend API Mappings', () => {
    it('should map authApi calls to correct endpoints', async () => {
        const { default: api, authApi } = await import('./index.js');
        const mockData = { email: 'test@example.com', password: 'password123' };
        
        api.post = vi.fn().mockResolvedValue({ data: { success: true } });
        
        await authApi.login(mockData);
        expect(api.post).toHaveBeenCalledWith('/auth/login', mockData);
    });

    it('should map tripsApi calls to correct endpoints', async () => {
        const { default: api, tripsApi } = await import('./index.js');
        api.get = vi.fn().mockResolvedValue({ data: [] });
        
        await tripsApi.getById('trip_123');
        expect(api.get).toHaveBeenCalledWith('/trips/trip_123');
    });
});
