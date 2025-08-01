import '@testing-library/jest-dom'
import 'whatwg-fetch' // Polyfill para fetch

// Mock de localStorage globalmente
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Resetear mocks antes de cada test
beforeEach(() => {
  jest.clearAllMocks()
})