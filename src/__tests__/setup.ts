import { jest } from '@jest/globals'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated'
  }))
}))

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn()
})) 