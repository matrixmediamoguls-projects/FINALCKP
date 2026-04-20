import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import { AuthProvider, useAuth } from './AuthContext';

jest.mock('axios');

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('initializes with loading state', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
  });

  test('loads user on mount', async () => {
    const mockUser = {
      user_id: 'user_123',
      email: 'test@example.com',
      name: 'Test User'
    };

    axios.get.mockResolvedValueOnce({ data: mockUser });

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  test('handles login', async () => {
    const mockUser = {
      user_id: 'user_123',
      email: 'test@example.com',
      name: 'Test User'
    };

    axios.get.mockResolvedValueOnce({ data: null });
    axios.post.mockResolvedValueOnce({ data: mockUser });

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let loginResponse;
    await act(async () => {
      loginResponse = await result.current.login('test@example.com', 'password123');
    });

    expect(loginResponse).toEqual(mockUser);
    expect(result.current.user).toEqual(mockUser);
  });

  test('handles logout', async () => {
    const mockUser = {
      user_id: 'user_123',
      email: 'test@example.com',
      name: 'Test User'
    };

    axios.get.mockResolvedValueOnce({ data: mockUser });
    axios.post.mockResolvedValueOnce({});

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });

  test('updates user progress', async () => {
    const mockUser = {
      user_id: 'user_123',
      email: 'test@example.com',
      level: 0
    };

    const updatedUser = {
      ...mockUser,
      level: 1,
      current_act: 2
    };

    axios.get.mockResolvedValueOnce({ data: mockUser });
    axios.put.mockResolvedValueOnce({ data: updatedUser });

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let updateResponse;
    await act(async () => {
      updateResponse = await result.current.updateProgress({
        level: 1,
        current_act: 2
      });
    });

    expect(updateResponse).toEqual(updatedUser);
    expect(result.current.user).toEqual(updatedUser);
  });

  test('schedules token refresh', async () => {
    const mockUser = {
      user_id: 'user_123',
      email: 'test@example.com'
    };

    axios.get.mockResolvedValueOnce({ data: mockUser });

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify setTimeout was called for token refresh
    expect(setTimeout).toHaveBeenCalled();
  });

  test('clears user on 401 response', async () => {
    const mockUser = {
      user_id: 'user_123',
      email: 'test@example.com'
    };

    axios.get.mockResolvedValueOnce({ data: mockUser });

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);

    // Simulate 401 response
    const interceptor = axios.interceptors.response.use.mock.results[0].value;
    act(() => {
      interceptor(Promise.reject({ response: { status: 401 } }));
    });

    expect(result.current.user).toBeNull();
  });
});
