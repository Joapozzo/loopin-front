import { renderHook } from '@testing-library/react';

jest.mock('../useAuth', () => ({
  useAuth: () => ({
    user: { uid: 'test-user-123' },
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  })
}));

import { useUserProfile } from '../userProfile'; 

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debería retornar error cuando no hay datos', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useUserProfile());
    
    expect(result.current.userData).toBeNull();
    expect(result.current.error).toBe('No se encontraron datos del usuario');
  });

  test('debería cargar datos del usuario correctamente', () => {
    const mockUser = {
      cli_nom: 'Juan',
      cli_ape: 'Pérez',
      usu_username: 'jperez'
    };
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ usuario: mockUser }));
    
    const { result } = renderHook(() => useUserProfile());
    
    expect(result.current.userData).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  test('debería manejar usuario no autenticado', () => {
    // Para este test específico, mockeamos sin usuario
    const useAuthMock = require('../useAuth');
    useAuthMock.useAuth = jest.fn(() => ({
      user: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    }));

    const { result } = renderHook(() => useUserProfile());
    
    expect(result.current.userData).toBeNull();
    expect(result.current.error).toBe('Usuario no autenticado');
  });
});